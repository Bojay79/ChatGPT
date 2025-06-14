# Consistent Character Prompt Generator

This is a simple web-based application to generate consistent character prompts for AI image generators like MidJourney or for use in ChatGPT.

## How to Use

1.  Open the `index.html` file in your web browser.
2.  Fill in the fields in the form with the details of your character and scene.
3.  Click the "Generate Prompt" button.
4.  The generated prompt will appear in both Indonesian and English in the text areas below.
5.  You can then copy the prompt and use it as needed.

## Features

*   **Structured Prompt Generation:** Creates prompts based on a predefined structure for consistency.
*   **Indonesian and English Outputs:** Provides the prompt in both languages.
*   **Style Change Prompt:** Generates a prompt that can be used to request a style change from an AI.
*   **Placeholders for Future Features:** Buttons for "Ganti Cerita" (Change Story) and "Buatkan Scene Berikutnya" (Create Next Scene) are included, with their logic to be implemented.

## File Structure

*   `index.html`: The main HTML file containing the structure of the web page.
*   `style.css`: The CSS file for styling the web page.
*   `script.js`: The JavaScript file containing the logic for prompt generation.

## Fitur Prompt Konsisten Karakter ChatGPT (Pixar Style)

- Masukkan atau edit prompt deskripsi karakter dalam Bahasa Indonesia pada kolom kiri.
- Klik tombol "Generate" untuk menghasilkan prompt Bahasa Inggris yang sudah dikembangkan dan sesuai struktur prompt ChatGPT pada kolom kanan (tidak bisa diedit).
- Prompt Bahasa Indonesia akan otomatis dikembangkan jika terlalu singkat, dan hasil akhir Bahasa Inggris akan lebih detail, natural, serta sesuai struktur prompt ChatGPT.
- Struktur hasil prompt sudah mencakup:
  - Pengantar
  - Instruksi detail (visual, ekspresi, pose, elemen unik, kualitas koleksi)
  - Penutup

Cocok untuk membuat prompt konsisten karakter 3D (gaya Pixar) untuk ChatGPT atau AI lain. 