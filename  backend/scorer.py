def compute_final_score(ocr, forensics, sig, pdf_info):
    ela_scores = [ev["score"] for ev in forensics["evidence"] if ev["type"]=="ela"]
    ela_score = sum(ela_scores)/len(ela_scores) if ela_scores else 0.0
    signature_similarity = sig.get("similarity", 0.5)
    metadata_risk = 0.2 if "error" in pdf_info else 0.0

    # Simple linear combination
    fraud_probability = 0.5*ela_score + 0.3*(1-signature_similarity) + 0.2*metadata_risk

    if fraud_probability < 0.2:
        verdict = "APPROVED"
    elif fraud_probability < 0.5:
        verdict = "SUSPICIOUS"
    else:
        verdict = "REJECTED"

    breakdown = {
        "signature_similarity": signature_similarity,
        "ela_score": ela_score,
        "copy_move_score": 0.0,
        "font_mismatch_score": 0.0,
        "metadata_risk_score": metadata_risk
    }
    return verdict, fraud_probability, breakdown
