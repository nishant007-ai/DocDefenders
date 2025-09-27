from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import uuid, os, datetime
from pdf_parser import parse_pdf
from preprocess import preprocess_file
from ocr_layout import run_ocr_layout
from forensics import run_forensics
from signature_model import verify_signature
from scorer import compute_final_score

app = FastAPI(title="DocDefenders API")

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "artifacts"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/api/verify_document")
async def verify_document(
    file: UploadFile,
    doc_type: str = Form("transcript"),
    user_id: str = Form("anonymous"),
    prefer_strict_mode: bool = Form(False),
):
    job_id = str(uuid.uuid4())
    uploaded_at = datetime.datetime.now().isoformat()

    # Save file
    filepath = os.path.join(UPLOAD_DIR, f"{job_id}_{file.filename}")
    with open(filepath, "wb") as f:
        f.write(await file.read())

    # Step 1: Parse
    pdf_info = parse_pdf(filepath)

    # Step 2: Preprocess
    preprocessed_images = preprocess_file(filepath)

    # Step 3: OCR & Layout
    ocr_results = run_ocr_layout(preprocessed_images)

    # Step 4–6: Forensics + Signature
    forensic_results = run_forensics(preprocessed_images)
    sig_results = verify_signature(preprocessed_images)

    # Step 7–8: Scoring
    verdict, probability, breakdown = compute_final_score(
        ocr_results, forensic_results, sig_results, pdf_info
    )

    completed_at = datetime.datetime.now().isoformat()

    # Step 9: JSON Response
    response = {
        "job_id": job_id,
        "status": "completed",
        "verdict": verdict,
        "fraud_probability": probability,
        "score_breakdown": breakdown,
        "evidence": forensic_results["evidence"],
        "actions": {
            "annotated_pdf_url": f"/download/annotated_{job_id}.pdf",
            "escalate_to_admin": verdict == "REJECTED",
            "request_rescan": verdict == "SUSPICIOUS",
            "send_email_notification": True
        },
        "timestamps": {
            "uploaded_at": uploaded_at,
            "completed_at": completed_at
        }
    }

    return response
