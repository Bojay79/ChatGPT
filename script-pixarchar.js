document.addEventListener('DOMContentLoaded', () => {
    const indoInput = document.getElementById('prompt-indo');
    const engOutput = document.getElementById('prompt-eng');
    const generateBtn = document.getElementById('generate-pixarchar');
    const loadingIndicator = document.getElementById('loading-indicator');

    // Fungsi untuk mengembangkan prompt Indonesia menjadi lebih detail
    function kembangkanPromptIndo(prompt) {
        let hasil = prompt.trim();
        // Tambahkan pengantar jika belum ada
        if (!hasil.match(/prompt dwibahasa|deskripsi rinci/i)) {
            hasil = 'Tentu, ini adalah prompt dwibahasa untuk ChatGPT berdasarkan permintaan Anda:\n\nBahasa Indonesia:\n' + hasil;
        }
        // Tambahkan instruksi detail jika belum ada
        if (!hasil.match(/Fokus pada elemen-elemen berikut|Fokus pada detail visual/i)) {
            hasil += '\nFokus pada elemen-elemen berikut untuk menciptakan deskripsi yang estetik dan konsisten:\n* Desain Visual: Jelaskan bentuk tubuh dan proporsi figur secara keseluruhan dengan gaya Pixar yang khas, ramah, dan ter-stylize. Berikan perhatian khusus pada penggambaran kemeja batik yang rumit – bagaimana Pixar akan menyederhanakan dan men-stylize pola yang kompleks ini sambil tetap mempertahankan kekayaan dan warnanya? Jelaskan tekstur dan jatuhnya kain.\n* Kepala & Ekspresi: Jelaskan wajahnya, termasuk kepala botak, janggut pendek, dan yang terpenting, senyum hangat yang ramah dan ekspresi mudah didekati seperti yang terlihat di gambar. Mata khas Pixar seperti apa yang dimiliki karakter ini?\n* Pose: Jelaskan posenya, berdasarkan posisi lengan bersilang seperti di gambar. Bagaimana pose ini akan diterjemahkan menjadi pose figur aksi yang dinamis namun tetap khas?\n* Elemen Unik: Tekankan gelang manik-manik yang khas di pergelangan tangan.\n* Kualitas Estetik / Koleksi: Jelaskan figur ini sedemikian rupa untuk menonjolkan daya tarik estetiknya dan nilai koleksinya, seolah-olah ini adalah barang dagangan berkualitas tinggi. Gunakan bahasa yang menggambarkan keahlian dan daya tarik visual yang akan membuatnya menjadi barang koleksi yang diinginkan.';
        }
        return hasil;
    }

    // Fungsi untuk menerjemahkan dan mengembangkan prompt ke Bahasa Inggris
    async function translateAndDevelopPrompt(indoPrompt) {
        // Kembangkan prompt Indonesia dulu
        const promptKembang = kembangkanPromptIndo(indoPrompt);
        // Panggil API terjemahan gratis (MyMemory)
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(promptKembang)}&langpair=id|en`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            let eng = data.responseData.translatedText;
            // Kembangkan hasil terjemahan agar lebih natural dan sesuai struktur prompt ChatGPT
            eng = developEnglishPrompt(eng);
            return eng;
        } catch (e) {
            return '[Translation Error] ' + indoPrompt;
        }
    }

    // Fungsi untuk mengembangkan prompt Inggris agar lebih detail dan natural
    function developEnglishPrompt(engPrompt) {
        // Tambahkan pengantar dan penutup, serta perbaiki struktur
        let result = `Certainly, here is a bilingual prompt for ChatGPT based on your request:\n\nEnglish:\nGenerate a detailed and vivid description for a collectible 3D action figure, rendered in the vibrant and charming style of Pixar animation. This figure is based on the person depicted in the uploaded image, capturing their likeness through the Pixar lens. Focus on the following elements to create an aesthetic and consistent description:\n* Visual Design: Describe the overall body shape and proportions of the figure in the signature, friendly, and stylized Pixar manner. Pay special attention to the depiction of the intricate batik shirt – how would Pixar simplify and stylize this complex pattern while retaining its richness and color? Describe the fabric's texture and drape.\n* Head & Expression: Describe the face, including the bald head, short beard, and most importantly, the warm, friendly smile and approachable expression as seen in the image. What kind of signature Pixar eyes does this character have?\n* Pose: Describe the pose, based on the crossed-arm position as in the image. How would this translate into a dynamic yet characteristic action figure pose?\n* Unique Elements: Emphasize the distinctive beaded bracelet on the wrist.\n* Aesthetic / Collectible Quality: Describe the figure in a way that highlights its aesthetic appeal and collectible value, as if it were a high-quality merchandise item. Use language that conveys craftsmanship and visual appeal, making it a desirable collectible.\n\nMake sure the description is vivid, aesthetic, and suitable for high-quality collectible merchandise.\n`;
        // Jika hasil terjemahan sudah mengandung detail, tambahkan di bawah
        if (engPrompt && engPrompt.length > 50) {
            result += '\n---\n\n' + engPrompt.trim();
        }
        return result;
    }

    generateBtn.addEventListener('click', async () => {
        const indoPrompt = indoInput.value.trim();
        if (!indoPrompt) {
            alert('Silakan isi prompt Bahasa Indonesia terlebih dahulu!');
            return;
        }
        engOutput.value = '';
        loadingIndicator.classList.remove('hidden');
        const engPrompt = await translateAndDevelopPrompt(indoPrompt);
        engOutput.value = engPrompt;
        loadingIndicator.classList.add('hidden');
    });
}); 