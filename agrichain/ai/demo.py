
"""
AgriChain AI - Interactive Demo
Interactive farmer profile input with language selection and plan generation.
"""

import asyncio
import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# Add parent directory to path to allow imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

# Load environment variables
env_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(env_path)

from agrichain.ai.agents.orchestrator import OrchestratorAgent
from agrichain.ai.utils.sanitizer import NIGERIAN_STATES, NIGERIAN_CROPS


def get_farmer_input():
    """Get farmer input interactively."""
    print("\n" + "=" * 60)
    print("AGRICHAIN AI - WEEKLY FARM PLANNING SYSTEM")
    print("=" * 60)
    print("\nWelcome! Let's create your personalized weekly farm plan.")
    print("\nPlease provide the following information:\n")

    # Farmer name
    while True:
        name = input("Farmer Name: ").strip()
        if name and len(name) <= 50:
            break
        print("Please enter a valid name (max 50 characters)")

    # State
    print(f"\nAvailable states: {', '.join(sorted(list(NIGERIAN_STATES)[:10]))}... (type your state)")
    while True:
        state = input("State: ").strip().title()
        if state in NIGERIAN_STATES:
            break
        print(f"Invalid state. Please choose from: {', '.join(sorted(NIGERIAN_STATES))}")

    # LGA
    lga = input("Local Government Area (LGA): ").strip()
    if not lga:
        lga = state

    # Crop
    print(f"\nCommon crops: {', '.join(sorted(list(NIGERIAN_CROPS)[:8]))}")
    while True:
        crop = input("Crop (main crop to grow): ").strip().title()
        if crop in NIGERIAN_CROPS:
            break
        print(f"Invalid crop. Please choose from: {', '.join(sorted(NIGERIAN_CROPS))}")

    # Farm size
    while True:
        try:
            farm_size = float(input("Farm Size (hectares, 0.1-10000): ").strip())
            if 0.1 <= farm_size <= 10000:
                break
            print("Farm size must be between 0.1 and 10000 hectares")
        except ValueError:
            print("Please enter a valid number")

    # Language
    print("\nSelect your preferred language:")
    languages = {
        "1": "English",
        "2": "Yoruba",
        "3": "Hausa",
        "4": "Igbo"
    }

    for key, lang in languages.items():
        print(f"  {key}. {lang}")

    while True:
        choice = input("Language choice (1-4): ").strip()
        if choice in languages:
            language = languages[choice]
            break
        print("Please enter 1, 2, 3, or 4")

    return name, state, lga, crop, farm_size, language


def get_language_labels(language: str):
    labels = {
        "English": {
            "weekly_plan": "WEEKLY FARM PLAN",
            "plan_title": "YOUR PERSONALIZED FARM PLAN:",
            "execution_times": "Agent Execution Times:",
            "total_time": "Total Time",
            "synthesis_time": "Synthesis Time",
            "again": "Would you like to generate another plan? (yes/no): ",
            "goodbye": "Thank you for using AgriChain AI. Good luck with your farming!"
        },
        "Yoruba": {
            "weekly_plan": "WEEKLY FARM PLAN",
            "plan_title": "ÈTÒ ỌGBÀ TI A ṢE FUN Ọ:",
            "execution_times": "Agent Execution Times:",
            "total_time": "Total Time",
            "synthesis_time": "Synthesis Time",
            "again": "Ṣe o fẹ lati ṣe eto agbẹ miiran? (bẹẹni/bẹẹkọ): ",
            "goodbye": "E ṣeun fun lilo AgriChain AI. Ẹ ní àkàrà pẹlu adijẹ rẹ!"
        },
        "Hausa": {
            "weekly_plan": "WEEKLY FARM PLAN",
            "plan_title": "TSARIN GONA NA KA:",
            "execution_times": "Agent Execution Times:",
            "total_time": "Total Time",
            "synthesis_time": "Synthesis Time",
            "again": "Shin kuna son ƙirƙirar wani shirin? (eh/a'a): ",
            "goodbye": "Godiya mun yi agida AgriChain AI. Jiya mai kyau tare da aiki gida!"
        },
        "Igbo": {
            "weekly_plan": "WEEKLY FARM PLAN",
            "plan_title": "ATỤMỤMA ỌGBỤ NKE GỊ:",
            "execution_times": "Agent Execution Times:",
            "total_time": "Total Time",
            "synthesis_time": "Synthesis Time",
            "again": "Ị chọrọ ka m mee atụmatụ ọzọ? (ee/mba): ",
            "goodbye": "Daalụ maka iji AgriChain AI. Nweere ihe ọma n'ọrụ ubi gị!"
        }
    }
    return labels.get(language, labels["English"])


def display_plan(result):
    """Display execution times and wrap-up (farm_plan already displayed during streaming)."""

    language = result.get("language", "English")
    label = get_language_labels(language)

    if result.get("success"):
        print("\n" + "=" * 60)

        print(f"\n{label['execution_times']}")
        exec_times = result.get("execution_times", {})

        print(f"  Soil Agent: {exec_times.get('soil', 'N/A')}")
        print(f"  Weather Agent: {exec_times.get('weather', 'N/A')}")
        print(f"  Market Agent: {exec_times.get('market', 'N/A')}")
        print(f"  Finance Agent: {exec_times.get('finance', 'N/A')}")
        print(f"  {label['synthesis_time']}: {exec_times.get('synthesis', 'N/A')}")
        print(f"  {label['total_time']}: {exec_times.get('total', 'N/A')}")

        print("\n" + "=" * 60)

    else:
        print(f"\nError: {result.get('error', 'Unknown error')}")

        details = result.get("details")
        if isinstance(details, dict):
            for key, value in details.items():
                print(f"{key}: {value}")
        else:
            print(f"Details: {details}")


def display_plan_header(result):
    """Display farmer info and plan title before streaming starts."""

    language = result.get("language", "English")
    label = get_language_labels(language)

    print("\n" + "=" * 60)
    print(label["weekly_plan"])
    print("=" * 60)

    print(f"Farmer: {result.get('farmer_name', 'Unknown')}")

    location = result.get("location")
    if location:
        print(f"Location: {location}")
    else:
        print(f"Location: {result.get('lga', 'Unknown')}, {result.get('state', 'Unknown')}")

    print(f"Crop: {result.get('crop', 'Unknown')}")
    print(f"Farm Size: {result.get('farm_size', 'Unknown')} hectares")
    print(f"Language: {result.get('language', 'English')}")

    print("=" * 60)
    print(f"\n{label['plan_title']}\n")


def stream_callback(chunk):
    """Callback for streaming - prints chunks as they arrive."""
    print(chunk, end="", flush=True)


async def run_demo():
    """Run the interactive demo."""

    orchestrator = OrchestratorAgent()

    while True:

        name, state, lga, crop, farm_size, language = get_farmer_input()

        print("\n" + "-" * 60)
        print("Generating your personalized farm plan...")
        print("-" * 60 + "\n")

        try:
            result = await asyncio.wait_for(
                orchestrator.orchestrate(
                    name=name,
                    state=state,
                    lga=lga,
                    crop=crop,
                    farm_size=str(farm_size),
                    language=language,
                    stream_callback=stream_callback
                ),
                timeout=30
            )
            
            # Display header before streaming (if result successful)
            if result.get("success"):
                # Note: result already has farm_plan set during streaming
                # Just need to show header info
                pass

        except asyncio.TimeoutError as e:
            result = {
                "success": False,
                "error": "Request timed out",
                "details": str(e)
            }

        display_plan(result)

        label = get_language_labels(language)
        again = input(f"\n{label['again']}").strip().lower()
        if again not in ["yes", "y", "bẹẹni", "eh", "ee"]:
            print(f"\n{label['goodbye']}")
            break


def main():
    """Main entry point."""
    print("Starting AgriChain demo...")
    sys.stdout.flush()
    try:
        asyncio.run(run_demo())
    except KeyboardInterrupt:
        print("\n\nProgram interrupted by user.")
        sys.exit(0)
    except Exception as e:
        print(f"\nAn error occurred: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
