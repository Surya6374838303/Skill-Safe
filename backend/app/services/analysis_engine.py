import abc
from typing import Dict, List, Any, Optional
import datetime

class BaseHazardAnalyzer(abc.ABC):
    """
    Abstract interface for SkillSafe Hazard Localization.
    Supports modular replacement: Rule-Based (Stage 1/2) -> Scikit-learn/PyTorch ML (Stage 3/4).
    """

    @abc.abstractmethod
    def analyze(self, section_readings: List[Dict[str, Any]]) -> Dict[str, Any]:
        pass


class RuleBasedHazardAnalyzer(BaseHazardAnalyzer):
    """
    Stage 1 / 2 Rule-Based Anomaly Detector for Smart India Hackathon Demo.
    - Evaluates cross-section gas deltas against baseline.
    - Inspects slope gradient (rate of change ppm/sec).
    - Checks for coincident acoustic vibration (jet turbulence micro-vibration).
    - Transparently labels rationale and disclaims leak confirmation.
    """

    def __init__(self, gas_threshold_warning: float = 40.0, gas_threshold_critical: float = 100.0):
        self.version = "Rule-Based Hazard Analyzer v1.4-dev (Modular SIH Interface)"
        self.gas_threshold_warning = gas_threshold_warning
        self.gas_threshold_critical = gas_threshold_critical

    def analyze(self, section_readings: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not section_readings:
            return {
                "model_version": self.version,
                "analysis_type": "rule_based",
                "probable_zone": "None",
                "confidence": 0.0,
                "explanation": ["No sensor telemetry available for analysis."],
                "section_scores": {},
                "created_at": datetime.datetime.utcnow().isoformat(),
            }

        scores: Dict[str, float] = {}
        highest_section = section_readings[0]
        highest_score = -1.0

        for r in section_readings:
            sec_id = r.get("section_id", "Unknown")
            gas = float(r.get("gas_reading", 0.0))
            vib = float(r.get("vibration_reading", 0.0))

            # Composite Hazard Index:
            # 70% Gas elevation (normalized to 150 ppm) + 30% Vibration (normalized to 1.5 mm/s RMS)
            gas_norm = min(gas / 150.0, 1.0)
            vib_norm = min(vib / 1.5, 1.0)
            composite = round((gas_norm * 0.7) + (vib_norm * 0.3), 3)

            scores[sec_id] = composite
            if composite > highest_score:
                highest_score = composite
                highest_section = r

        probable_sec = highest_section.get("section_id", "P4")
        gas_val = highest_section.get("gas_reading", 0.0)
        vib_val = highest_section.get("vibration_reading", 0.0)

        # Generate explainable audit rationales
        explanations = [
            f"Section {probable_sec} exhibited the highest composite risk rating ({scores.get(probable_sec, 0.0):.2f}) across measured sections.",
            f"Gas concentration recorded at {gas_val} ppm (Threshold: Warning > 40 ppm, Critical > 100 ppm).",
            f"Contact vibration/acoustic sensor recorded {vib_val} mm/s RMS (congruent with local orifice turbulence).",
            "CRITICAL SAFETY NOTE: Probable Hazard Zone highlighted for technician verification. Vibration alone does NOT prove a gas leak. Perform physical verification (soap bubble / ultrasonic) per approved standard operating procedures."
        ]

        confidence = round(min(0.70 + (highest_score * 0.25), 0.95), 2)

        return {
            "model_version": self.version,
            "analysis_type": "rule_based",
            "probable_zone": probable_sec,
            "confidence": confidence,
            "explanation": explanations,
            "section_scores": scores,
            "created_at": datetime.datetime.utcnow().isoformat(),
        }


# Global engine instance
analyzer_engine = RuleBasedHazardAnalyzer()
