"""
AgriChain AI - Main entry point
"""
import asyncio
import sys
import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

# Add parent directory to path to allow imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

# Load environment variables
env_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(env_path)

from agrichain.ai.agents.orchestrator import OrchestratorAgent


def main():
    """Main function for AgriChain AI system."""
    orchestrator = OrchestratorAgent()
    
    # Run with sample data
    result = asyncio.run(
        orchestrator.orchestrate(
            name="Chukwuemeka",
            state="Kebbi",
            lga="Ngaski",
            crop="Rice",
            farm_size="2",
            language="Hausa"
        )
    )
    
    if result["success"]:
        print("\n" + "="*60)
        print("AGRICHAIN WEEKLY FARM PLAN")
        print("="*60)
        print(f"Farmer: {result['farmer_name']}")
        print(f"Location: {result['lga']}, {result['state']}")
        print(f"Crop: {result['crop']}")
        print(f"Farm Size: {result['farm_size']} hectares")
        print(f"Language: {result['language']}")
        print("="*60)
        print(result["farm_plan"])
        print("="*60)
        print(f"Execution time: {result['execution_times']['total']}")
    else:
        print(f"Error: {result['error']}")
        print(result.get("details", {}))


if __name__ == "__main__":
    main()
