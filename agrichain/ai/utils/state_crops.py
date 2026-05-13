"""
State-Specific Crop Database for Nigeria.
Maps Nigerian states to their primary crops based on climate, geography, and traditional cultivation.
"""

STATE_CROPS = {
    # Northern States
    "Kebbi": ["Rice", "Millet", "Sorghum", "Cowpea", "Groundnut", "Maize"],
    "Sokoto": ["Millet", "Sorghum", "Groundnut", "Cowpea", "Maize"],
    "Zamfara": ["Millet", "Sorghum", "Groundnut", "Cowpea", "Maize"],
    "Katsina": ["Millet", "Sorghum", "Groundnut", "Cowpea", "Maize", "Rice"],
    "Kano": ["Groundnut", "Millet", "Cowpea", "Maize", "Sorghum", "Rice"],
    "Jigawa": ["Millet", "Groundnut", "Cowpea", "Maize", "Sorghum"],
    "Bauchi": ["Sorghum", "Millet", "Maize", "Groundnut", "Cowpea"],
    "Gombe": ["Sorghum", "Millet", "Maize", "Groundnut", "Cowpea"],
    "Yobe": ["Millet", "Sorghum", "Groundnut", "Cowpea"],
    "Borno": ["Millet", "Sorghum", "Groundnut", "Cowpea"],
    "Adamawa": ["Sorghum", "Millet", "Maize", "Groundnut", "Rice", "Cowpea"],
    "Taraba": ["Yam", "Cassava", "Maize", "Beans", "Sorghum", "Millet"],
    "Nasarawa": ["Sorghum", "Maize", "Yam", "Cassava", "Beans", "Millet"],
    "Kaduna": ["Groundnut", "Maize", "Sorghum", "Cassava", "Yam", "Beans"],
    "Plateau": ["Maize", "Beans", "Yam", "Sorghum", "Cassava", "Potatoes"],
    "Kogi": ["Yam", "Cassava", "Maize", "Rice", "Beans", "Sorghum"],
    "Kwara": ["Yam", "Cassava", "Maize", "Rice", "Beans", "Groundnut"],
    "Niger": ["Maize", "Sorghum", "Millet", "Cowpea", "Rice"],
    
    # South-Western States
    "Lagos": ["Tomato", "Cassava", "Maize", "Yam", "Beans", "Leafy Vegetables"],
    "Ogun": ["Cassava", "Maize", "Yam", "Tomato", "Beans", "Leafy Vegetables"],
    "Oyo": ["Cassava", "Yam", "Maize", "Tomato", "Beans", "Sorghum"],
    "Osun": ["Yam", "Cassava", "Maize", "Beans", "Tomato"],
    "Ekiti": ["Yam", "Cassava", "Maize", "Beans", "Cocoa"],
    "Ondo": ["Cocoa", "Cassava", "Maize", "Yam", "Beans", "Plantain"],
    
    # South-Eastern States
    "Enugu": ["Yam", "Cassava", "Maize", "Beans", "Leafy Vegetables", "Tomato"],
    "Anambra": ["Yam", "Cassava", "Maize", "Beans", "Leafy Vegetables"],
    "Abia": ["Cassava", "Yam", "Maize", "Beans", "Leafy Vegetables"],
    "Ebonyi": ["Yam", "Cassava", "Maize", "Beans", "Leafy Vegetables"],
    "Imo": ["Cassava", "Yam", "Maize", "Beans", "Leafy Vegetables"],
    
    # South-Southern States
    "Rivers": ["Cassava", "Plantain", "Yam", "Maize", "Palm Products"],
    "Bayelsa": ["Cassava", "Plantain", "Yam", "Maize", "Leafy Vegetables"],
    "Delta": ["Cassava", "Plantain", "Maize", "Yam", "Palm Products"],
    "Edo": ["Cassava", "Plantain", "Maize", "Yam", "Beans"],
    "Cross River": ["Cassava", "Plantain", "Cocoa", "Yam", "Maize"],
    "Akwa Ibom": ["Cassava", "Plantain", "Yam", "Maize", "Leafy Vegetables"],
    
    # FCT
    "FCT": ["Maize", "Cassava", "Yam", "Beans", "Leafy Vegetables", "Tomato"],
}

# Common fruits/vegetables available in all states but with varying intensity
GENERAL_VEGETABLES = ["Leafy Vegetables", "Tomato", "Beans", "Carrots", "Peppers"]

# State-specific premium crops/fruits
PREMIUM_CROPS = {
    "Lagos": ["Tomato", "Leafy Vegetables"],
    "Ondo": ["Cocoa", "Plantain"],
    "Cross River": ["Cocoa", "Plantain"],
    "Ogun": ["Tomato", "Cassava"],
    "Plateau": ["Potatoes", "Beans"],
}


def get_state_crops(state: str) -> list:
    """
    Get list of crops suitable for a specific state.
    
    Args:
        state: Nigerian state name
    
    Returns:
        List of crops produced in that state
    """
    return STATE_CROPS.get(state, ["Maize", "Cassava", "Yam", "Beans"])


def get_state_premium_crops(state: str) -> list:
    """
    Get premium/high-value crops for a specific state.
    
    Args:
        state: Nigerian state name
    
    Returns:
        List of premium crops for that state
    """
    return PREMIUM_CROPS.get(state, [])


def is_crop_suitable_for_state(crop: str, state: str) -> bool:
    """
    Check if a crop is suitable for a specific state.
    
    Args:
        crop: Crop/fruit name
        state: Nigerian state name
    
    Returns:
        True if crop is suitable, False otherwise
    """
    state_crops = get_state_crops(state)
    return crop in state_crops or crop in GENERAL_VEGETABLES


def get_suitable_crops_for_state(state: str) -> list:
    """
    Get all suitable crops (state-specific + general vegetables) for a state.
    
    Args:
        state: Nigerian state name
    
    Returns:
        Combined list of suitable crops for the state
    """
    state_crops = get_state_crops(state)
    # Add general vegetables if not already present
    all_crops = state_crops + [v for v in GENERAL_VEGETABLES if v not in state_crops]
    return list(dict.fromkeys(all_crops))  # Remove duplicates while preserving order
