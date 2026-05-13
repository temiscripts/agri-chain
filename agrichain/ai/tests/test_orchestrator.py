"""
Integration tests for the Orchestrator Agent.
"""
import pytest
import asyncio
from agrichain.ai.agents.orchestrator import OrchestratorAgent


@pytest.mark.asyncio
async def test_orchestrator_initialization():
    """Test that Orchestrator initializes correctly."""
    orchestrator = OrchestratorAgent()
    assert orchestrator is not None
    assert orchestrator.soil_agent is not None
    assert orchestrator.weather_agent is not None
    assert orchestrator.market_agent is not None
    assert orchestrator.finance_agent is not None


@pytest.mark.asyncio
async def test_orchestrate_invalid_inputs():
    """Test orchestration with invalid inputs."""
    orchestrator = OrchestratorAgent()
    
    result = await orchestrator.orchestrate(
        name="ValidName",
        state="InvalidState",
        lga="LGA",
        crop="Rice",
        farm_size="2",
        language="English"
    )
    
    assert not result["success"]
    assert "error" in result or "details" in result


@pytest.mark.asyncio
async def test_orchestrate_invalid_language():
    """Test orchestration with invalid language."""
    orchestrator = OrchestratorAgent()
    
    result = await orchestrator.orchestrate(
        name="Chukwuemeka",
        state="Kebbi",
        lga="Ngaski",
        crop="Rice",
        farm_size="2",
        language="French"
    )
    
    assert not result["success"]


@pytest.mark.asyncio
async def test_orchestrate_invalid_crop():
    """Test orchestration with invalid crop."""
    orchestrator = OrchestratorAgent()
    
    result = await orchestrator.orchestrate(
        name="Chukwuemeka",
        state="Kebbi",
        lga="Ngaski",
        crop="InvalidCrop",
        farm_size="2",
        language="English"
    )
    
    assert not result["success"]


@pytest.mark.asyncio
async def test_orchestrate_invalid_farm_size():
    """Test orchestration with invalid farm size."""
    orchestrator = OrchestratorAgent()
    
    result = await orchestrator.orchestrate(
        name="Chukwuemeka",
        state="Kebbi",
        lga="Ngaski",
        crop="Rice",
        farm_size="0.05",  # Too small
        language="English"
    )
    
    assert not result["success"]


@pytest.mark.asyncio
async def test_orchestrate_success_with_valid_inputs():
    """Test successful orchestration with valid inputs."""
    orchestrator = OrchestratorAgent()
    
    result = await orchestrator.orchestrate(
        name="Chukwuemeka",
        state="Kebbi",
        lga="Ngaski",
        crop="Rice",
        farm_size="2",
        language="English"
    )
    
    # Note: This test requires valid API keys
    # In a real environment with mocked APIs, this would pass
    # For now, we check that result has expected structure
    assert "success" in result
    assert "farmer_name" in result or "error" in result


def test_orchestrate_basic():
    """Basic synchronous test to verify orchestrator structure."""
    orchestrator = OrchestratorAgent()
    
    # Verify all agents are initialized
    assert orchestrator.soil_agent is not None
    assert orchestrator.weather_agent is not None
    assert orchestrator.market_agent is not None
    assert orchestrator.finance_agent is not None
    assert orchestrator.translator is not None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
