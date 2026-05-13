"""
Language translation module using OpenAI API.
Supports: English, Yoruba, Hausa, Igbo
"""
import os
import logging
from typing import Optional
from openai import OpenAI

logger = logging.getLogger(__name__)


class Translator:
    """Translate agricultural plans to local languages."""
    
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        self.client = OpenAI(api_key=self.api_key)
    
    def translate(self, text: str, target_language: str) -> str:
        """
        Translate text to target language using natural translation (not literal).
        
        Args:
            text: Text to translate
            target_language: Target language (English, Yoruba, Hausa, Igbo)
        
        Returns:
            Translated text
        """
        if target_language == "English":
            return text
        
        system_prompt = f"""You are a professional agricultural translator specializing in {target_language}.
Translate the following farming plan into natural, fluent {target_language} that a farmer would understand.
Use agricultural terminology common in {target_language} speaking communities.
Preserve all numerical data (prices, dates, hectares).
Do NOT provide explanations, just the translation."""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": text}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            translated = response.choices[0].message.content.strip()
            return translated
        
        except Exception as e:
            logger.error(f"Translation error: {e}")
            return text  # Return original if translation fails
    
    def get_language_name(self, code: str) -> str:
        """Get full language name from code."""
        languages = {
            "EN": "English",
            "YO": "Yoruba",
            "HA": "Hausa",
            "IG": "Igbo"
        }
        return languages.get(code.upper(), "English")
