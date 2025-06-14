document.addEventListener('DOMContentLoaded', () => {
    const getEl = (id) => document.getElementById(id);

    const ids = {
        judulScene: 'judul_scene',
        deskripsiKarakter: 'deskripsi_karakter',
        aksiKarakter: 'aksi_karakter',
        dialogKarakter: 'dialog_karakter',
        ekspresiKarakter: 'ekspresi_karakter',
        latar: 'latar',
        detailVisual: 'detail_visual',
        suasana: 'suasana',
        negativePrompt: 'negative_prompt',
        outputId: 'output-id',
        outputEn: 'output-en',
        generateBtn: 'generate-btn',
        clearBtn: 'clear-btn',
        changeStoryBtn: 'change-story-btn',
        nextSceneBtn: 'next-scene-btn',
        loadingIndicator: 'loading-indicator'
    };

    const generateBtn = getEl(ids.generateBtn);
    const clearBtn = getEl(ids.clearBtn);
    const changeStoryBtn = getEl(ids.changeStoryBtn);
    const nextSceneBtn = getEl(ids.nextSceneBtn);
    const loadingIndicator = getEl(ids.loadingIndicator);

    const allInputs = [
        ids.judulScene, ids.deskripsiKarakter, ids.aksiKarakter, 
        ids.dialogKarakter, ids.ekspresiKarakter, ids.latar, 
        ids.detailVisual, ids.suasana, ids.negativePrompt
    ];
    const allOutputs = [ids.outputId, ids.outputEn];

    const generateIndonesianPrompt = (inputs) => {
        let prompt = `[SCENE: ${inputs.judulScene}] `;
        prompt += `${inputs.deskripsiKarakter}. `;
        prompt += `Dia sedang ${inputs.aksiKarakter}, `;
        prompt += `menunjukkan ekspresi ${inputs.ekspresiKarakter}. `;
        if (inputs.dialogKarakter) {
            prompt += `Dia berkata: "${inputs.dialogKarakter}". `;
        }
        prompt += `Latar belakangnya adalah ${inputs.latar}. `;
        prompt += `Detail visual tambahan termasuk ${inputs.detailVisual}, `;
        prompt += `menciptakan suasana ${inputs.suasana}. `;
        if (inputs.negativePrompt) {
            prompt += `--no ${inputs.negativePrompt.replace("Hindari:", "").trim()}`;
        }
        return prompt.replace(/\s\s+/g, ' ').trim();
    };

    const translateText = async (text, targetLang) => {
        const [mainText, dialog] = extractDialog(text);
        
        if (!mainText) {
             if (dialog) {
                return `"${dialog}"`;
            }
            return "";
        }

        try {
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(mainText)}&langpair=id|${targetLang}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.responseStatus !== 200) {
                 throw new Error(`API error! message: ${data.responseDetails}`);
            }

            const translatedMain = data.responseData.translatedText;
            return reinsertDialog(translatedMain, dialog);

        } catch (error) {
            console.error("Translation error:", error);
            return `[Translation Failed] ${reinsertDialog(mainText, dialog)}`;
        }
    };

    const extractDialog = (text) => {
        const dialogMatch = text.match(/Dia berkata: "([^"]*)"/);
        if (dialogMatch && dialogMatch[1]) {
            const mainText = text.replace(dialogMatch[0], 'She says: "---".');
            return [mainText, dialogMatch[1]];
        }
        return [text, null];
    };

    const reinsertDialog = (text, dialog) => {
        if (dialog) {
            return text.replace('She says: "---".', `She says: "${dialog}"`);
        }
        return text;
    };


    generateBtn.addEventListener('click', async () => {
        const inputs = {};
        allInputs.forEach(id => {
            inputs[id.replace(/_([a-z])/g, (g) => g[1].toUpperCase())] = getEl(id).value;
        });

        const indonesianPrompt = generateIndonesianPrompt(inputs);
        getEl(ids.outputId).value = indonesianPrompt;

        loadingIndicator.classList.remove('hidden');
        getEl(ids.outputEn).value = '';
        
        const englishPrompt = await translateText(indonesianPrompt, 'en');
        getEl(ids.outputEn).value = englishPrompt;

        loadingIndicator.classList.add('hidden');
    });

    clearBtn.addEventListener('click', () => {
        allInputs.forEach(id => getEl(id).value = '');
        allOutputs.forEach(id => getEl(id).value = '');
    });

    const fillWithExample = () => {
        getEl(ids.judulScene).value = 'Terminal bus malam';
        getEl(ids.deskripsiKarakter).value = 'Seorang vlogger wanita muda asal Minang berusia 27 tahun. Perawakan/Bentuk Tubuh: tubuh mungil, tinggi 158cm, bentuk badan proporsional. warna kulit: sawo matang cerah. Rambut: ikal sebahu, hitam kecokelatan, diikat setengah ke belakang. Wajah: wajah oval, alis tebal alami, mata hitam besar, senyum ramah, pipi merona, bibir natural dengan sentuhan lip tint. Pakaian: mengenakan jaket parasut warna kuning mustard dan celana panjang hitam, membawa ransel kecil.';
        getEl(ids.aksiKarakter).value = 'berjalan di sekitar terminal bus malam sambil melihat-lihat aktivitas penumpang dan pedagang.';
        getEl(ids.ekspresiKarakter).value = 'Karakter menunjukkan ekspresi kagum dan antusias, sering tersenyum sambil melirik kamera.';
        getEl(ids.latar).value = 'latar tempat: di terminal bus antar kota malam hari, terdapat pedagang kaki lima di pinggir jalur keberangkatan, beberapa bus berjajar dengan lampu menyala. Waktu: malam hari, hujan rintik-rintik.';
        getEl(ids.detailVisual).value = 'Pencahayaan: natural dari lampu jalan dan lampu bus, pantulan cahaya pada aspal basah. Kualitas Visual: Resolusi 4K.';
        getEl(ids.suasana).value = 'Suasana sibuk, ramai, dengan kesan perjalanan malam yang hidup dan dinamis meskipun hujan.';
        getEl(ids.negativePrompt).value = 'Hindari: anggota badan cacat, tangan tidak normal, kualitas rendah, buram.';
    };
    
    fillWithExample();
    
    const randomStoryData = {
        characters: [
            'Seorang mahasiswa IT jenius berusia 21 tahun, sering terlihat lelah karena begadang. Perawakan kurus tinggi, rambut berantakan, dan selalu memakai kacamata. Pakaiannya simpel, hanya kaos band metal dan celana jeans.',
            'Seorang seniman jalanan misterius berusia 30-an. Wajahnya jarang terlihat jelas karena selalu memakai topi fedora dan masker. Tangannya penuh dengan noda cat warna-warni. Dia membawa tas selempang tua berisi peralatan melukisnya.',
            'Seorang detektif swasta wanita tangguh berusia 45 tahun dari Jakarta. Gaya bicaranya ceplas-ceplos. Rambutnya sebahu, sering diikat ekor kuda. Dia selalu mengenakan kemeja dan celana bahan, dengan tatapan mata yang tajam dan analitis.'
        ],
        scenes: [
            { scene: 'Perpustakaan kota yang sepi', action: 'sedang mencari buku langka di rak paling atas.', expression: 'fokus dan sedikit frustrasi.', setting: 'di antara rak-rak buku yang menjulang tinggi, cahaya temaram dari lampu baca. Waktu: sore hari.' },
            { scene: 'Pasar malam yang ramai', action: 'mencicipi jajanan lokal di salah satu kios.', expression: 'terlihat sangat menikmati makanannya.', setting: 'di tengah kerumunan orang, lampu warna-warni dari wahana permainan. Waktu: malam hari.' },
            { scene: 'Sebuah kafe bergaya retro', action: 'duduk di dekat jendela, menulis di laptopnya sambil menyeruput kopi.', expression: 'terlihat serius dan tenggelam dalam pikirannya.', setting: 'interior kafe dengan furnitur kayu dan poster-poster film lama. Waktu: siang hari, cuaca cerah.' }
        ]
    };

    changeStoryBtn.addEventListener('click', () => {
        const randomChar = randomStoryData.characters[Math.floor(Math.random() * randomStoryData.characters.length)];
        const randomScene = randomStoryData.scenes[Math.floor(Math.random() * randomStoryData.scenes.length)];

        getEl(ids.deskripsiKarakter).value = randomChar;
        getEl(ids.judulScene).value = randomScene.scene;
        getEl(ids.aksiKarakter).value = randomScene.action;
        getEl(ids.ekspresiKarakter).value = randomScene.expression;
        getEl(ids.latar).value = randomScene.setting;
        getEl(ids.dialogKarakter).value = ''; // Clear dialog for new story
        
        // Clear previous output
        allOutputs.forEach(id => getEl(id).value = '');
    });

    nextSceneBtn.addEventListener('click', () => {
        if (!getEl(ids.deskripsiKarakter).value) {
            alert('Silakan buat karakter terlebih dahulu sebelum membuat scene berikutnya!');
            return;
        }

        // Simple logic for next scene: new action, expression, and dialog
        const nextActions = ['berjalan ke arah kamera.', 'melihat ke luar jendela dengan tatapan termenung.', 'memeriksa ponselnya dan tersenyum tipis.'];
        const nextExpressions = ['penasaran.', 'sedih dan melankolis.', 'gembira dan penuh harap.'];
        const nextDialogs = ['"Aku harus segera pergi dari sini."', '"Mungkin ini bukan ide yang bagus."', '"Akhirnya, aku menemukannya."'];

        getEl(ids.aksiKarakter).value = nextActions[Math.floor(Math.random() * nextActions.length)];
        getEl(ids.ekspresiKarakter).value = nextExpressions[Math.floor(Math.random() * nextExpressions.length)];
        getEl(ids.dialogKarakter).value = nextDialogs[Math.floor(Math.random() * nextDialogs.length)];

        alert('Aksi, ekspresi, dan dialog karakter telah diubah untuk scene berikutnya. Anda bisa menyesuaikan Latar Tempat & Waktu jika perlu, lalu klik "Generate Prompt".');
    });
}); 