import random
import string
from app.models.enums import RoleEnum

def generate_unique_id(role: RoleEnum) -> str:
    """
    Generates a unique 6-character alphanumeric string.
    Prefixes with 'FA-' for farmers and 'OW-' for storage owners.
    """
    prefix = "FA-" if role == RoleEnum.farmer else "OW-"
    
    # Generate 6 random uppercase letters and digits
    characters = string.ascii_uppercase + string.digits
    random_str = ''.join(random.choices(characters, k=6))
    
    return f"{prefix}{random_str}"
