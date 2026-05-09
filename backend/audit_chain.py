import hashlib
import json
from datetime import datetime, timezone
from models import AuditBlock, AnalysisResult

GENESIS_HASH = "0" * 64   # sentinel previous-hash for block #1


def _sha256(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()


def compute_data_hash(input_data, analysis):
    # Dump each Pydantic model inside the list
    analysis_dump = [a.model_dump() for a in analysis] if isinstance(analysis, list) else analysis.model_dump()
    
<<<<<<< HEAD
    if isinstance(input_data, str):
        input_data = input_data.strip()


=======
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3
    payload = {
        "input_data": input_data,
        "analysis": analysis_dump
    }
    
<<<<<<< HEAD
    return _sha256(json.dumps(payload, sort_keys=True, default=str))
=======
    return _sha256(json.dumps(payload, sort_keys=True))
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3


def compute_block_hash(previous_hash: str, data_hash: str) -> str:
    """Chain link: hash(prev_hash + data_hash)."""
    return _sha256(previous_hash + data_hash)


def build_block(
    block_id: int,
    previous_hash: str,
<<<<<<< HEAD
    input_data: any,
    analysis: list[AnalysisResult],
=======
    input_data: dict,
    analysis: AnalysisResult,
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3
) -> AuditBlock:
    data_hash  = compute_data_hash(input_data, analysis)
    block_hash = compute_block_hash(previous_hash, data_hash)
    return AuditBlock(
        id=block_id,
        timestamp=datetime.now(timezone.utc),
        previous_hash=previous_hash,
        data_hash=data_hash,
        block_hash=block_hash,
        input_data=input_data,
        analysis=analysis,
    )


def verify_chain(blocks: list[AuditBlock]) -> bool:
    """Returns True if every block's hashes are consistent."""
    for i, block in enumerate(blocks):
        expected_prev = GENESIS_HASH if i == 0 else blocks[i - 1].block_hash
        if block.previous_hash != expected_prev:
            return False
        if block.data_hash != compute_data_hash(block.input_data, block.analysis):
            return False
        if block.block_hash != compute_block_hash(block.previous_hash, block.data_hash):
            return False
    return True
