const input_Text = document.getElementById('input-text');
const translate_Button = document.getElementById('translate-button');
const papago = document.getElementById('output-papago');
const deepL = document.getElementById('output-deepl');
const google_Cloud_Translate = document.getElementById('output-google');
const microsoft_Azure = document.getElementById('output-microsoft');
//const Amazon_Translate = document.getElementById('output-amazon');
//const IBM_Watson = document.getElementById('output-IBM-Watson');

// select 엘리먼트 가져오기\
const source_lang_Select = document.getElementById('source_lang');
const target_papago_Select = document.getElementById('language-papago'); // select 태그의 id를 사용
const target_deepl_Select = document.getElementById('language-deepl');
const target_google_Select = document.getElementById('language-google');
const target_microsoft_Select = document.getElementById('language-microsoft');
//const target_amazon_Select = document.getElementById('language-amazon');
//const target_IBM_Watson_Select = document.getElementById('language-IBM-Watson');

// select 값 가져오는 방법 1: value 속성 사용
//const amazon_selected_Value = target_amazon_Select.value;

// select 값 가져오는 방법 2: 선택된 option의 텍스트 가져오기
//const selectedText = targetdeeplSelect.options[targetdeeplSelect.selectedIndex].text;

//papago 번역기
//CORS 정책 떄문에 서버를 거치지 않으면 사용 불가
//Node.js 필요
async function translateWithPapago(text, sourceLang, targetLang) {
    const papago_client_id = 'ogwo51ja4q';
    const papago_apiKey = 'pObTOdYCeFpFbyfvwb4dDrNNLkzuZ7EbyJrjBSAP';
    const proxy_url = 'https://corsproxy.io/?';
    const papago_url = 'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation';

    // if(sourceLang == "auto"){
    //     sourceLang = await detectLanguageWithPapago(text);
    //     if (!sourceLang) return;
    // }

    const params = new URLSearchParams({
        source: sourceLang,
        target: targetLang,
        text: text,
    });

    try{
        const response = await fetch(papago_url, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'X-NCP-APIGW-API-KEY-ID': papago_client_id,
                'X-NCP-APIGW-API-KEY': papago_apiKey,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        papago.textContent = data.message.result.translatedText;
    } catch (error) {
        console.error('Error:', error);
    }
}

//deepL 번역기
async function translateWithDeepL(text, sourceLang, targetLang) {
    const deepL_apiKey = 'b2554f21-6815-4c7e-9fe0-7e99107f3289:fx'; // DeepL에서 발급받은 API 키
    const deepL_url = 'https://api-free.deepl.com/v2/translate';

    if(sourceLang == "auto"){
        //deepL은 언어 감지 기능이 없어서 google 번역기의 언어 감지 기능을 사용
        sourceLang = await detectLanguageWithGoogle(text);
        if (!sourceLang) return;
    }

    if(sourceLang == targetLang){
        deepL.textContent = text;
        return;
    }

    const params = new URLSearchParams({
        auth_key: deepL_apiKey,
        text: text,
        source_lang: sourceLang,
        target_lang: targetLang,
    });

    try {
        const response = await fetch(deepL_url, { //await 키워드를 사용하여 fetch 함수의 결과를 기다린 후 response에 저장
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', //URLSearchParams는 x-www-form-urlencoded 형식으로 데이터를 전송
            },                                                       //deepL은 x-www-form-urlencoded 형식을 사용
            body: params, //즉 body에는 params를 전달(x-www-form-urlencoded 형식)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        deepL.textContent = data.translations[0].text;
    } catch (error) {
        console.error('번역 오류:', error);
        deepL.textContent = '번역 오류';
    }
}

//google 번역기
//언어 감지
async function detectLanguageWithGoogle(text) {
    const apiKey = 'AIzaSyAsB4qjZj9ZRcTNsysdVeKJlVwcdKpTLBs';
    const url = `https://translation.googleapis.com/language/translate/v2/detect?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', //Google Cloud는 JSON 형식을 사용
            },
            body: JSON.stringify({q: text}), //즉 body에는 {q: text}를 전달(JSON 형식)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.data.detections[0][0].language;
    } catch (error) {
        console.error('언어 감지 오류:', error);
        return null;
    }
}
//번역
async function translateWithGoogle(text, sourceLang, targetLang) {
    const apiKey = 'AIzaSyAsB4qjZj9ZRcTNsysdVeKJlVwcdKpTLBs'; // Google Cloud API 키
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    if(sourceLang == "auto"){
        sourceLang = await detectLanguageWithGoogle(text);
        if (!sourceLang) return;
    }

    if(sourceLang == targetLang){
        google_Cloud_Translate.textContent = text;
        return;
    }

    const requestBody = {
        q: text, // 번역할 텍스트
        source: sourceLang, // 소스 언어 (예: 'en')
        target: targetLang, // 타겟 언어 (예: 'ko')
        format: 'text' // 텍스트 형식
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)   //google cloud는 JSON 형식을 사용
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
 
    const data = await response.json();
    google_Cloud_Translate.textContent = data.data.translations[0].translatedText;
    return data.data.translations[0].translatedText;
    } catch (error) {
        console.error('번역 오류:', error);
        google_Cloud_Translate.textContent = '번역 오류';
    }
}

//microsoft 번역기
//언어감지
async function detectLanguageWithMicrosoftAzure(text) {
    const microsoftApiKey = '3uwlZXwyqNDSgQMgLkOlnLeYlOeL8Ek83rumRHdnACtOFSHtOUitJQQJ99ALACNns7RXJ3w3AAAbACOGnPrY'; // 여기에 Azure API 키를 입력하세요
    const microsoftUrl = 'https://api.cognitive.microsofttranslator.com/detect?api-version=3.0';

    const requestBody = [{
        text: text
    }];

    try {
        const response = await fetch(microsoftUrl, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': microsoftApiKey,
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Region': 'koreacentral', // 여기에 Azure 리전을 입력하세요
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
        }

        const data = await response.json();
        return data[0].language; // 감지된 언어 반환
    } catch (error) {
        console.error('언어 감지 오류:', error);
        return null;
    }
}

//번역기
async function translateWithMicrosoft(text, sourceLang, targetLang) {
    const microsoft_apiKey = '3uwlZXwyqNDSgQMgLkOlnLeYlOeL8Ek83rumRHdnACtOFSHtOUitJQQJ99ALACNns7RXJ3w3AAAbACOGnPrY';
    if(sourceLang == "auto"){
        sourceLang = await detectLanguageWithMicrosoftAzure(text);
        if (!sourceLang) return;
    }

    const microsoft_url = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=' + sourceLang + '&to=' + targetLang;

    const requestBody = [{
        text: text
    }];

    if(sourceLang == targetLang){
        microsoft_Azure.textContent = text;
        return;
    }

    try{
        const response = await fetch(microsoft_url, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': microsoft_apiKey,
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Region': 'koreacentral',
            },
            body: JSON.stringify(requestBody)
        });
        if(!response.ok){
            const errorMessage = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
        }
        const data = await response.json();
        microsoft_Azure.textContent = data[0].translations[0].text;
    } catch (error) {
        console.error('번역 오류:', error);
        microsoft_Azure.textContent = '번역 오류';
    }
}

//amazon 번역기
// async function translateWithAmazon(text, sourceLang, targetLang) {
//     const amazon_apiKey = 'b2554f21-6815-4c7e-9fe0-7e99107f3289:fx';
// }

// //IBM-Watson 번역기
// async function translateWithIBM_Watson(text, sourceLang, targetLang) {
//     const IBM_Watson_apiKey = 'b2554f21-6815-4c7e-9fe0-7e99107f3289:fx';
// }

translate_Button.addEventListener('click', () => {
    const input_lang = input_Text.value;
    const source_lang_selected_Value = source_lang_Select.value;
    
    //papago 번역기
    const papago_selected_Value = target_papago_Select.value;
    translateWithPapago(input_lang, source_lang_selected_Value, papago_selected_Value);

    //deepL 번역기
    const deepl_selected_Value = target_deepl_Select.value;
    translateWithDeepL(input_lang, source_lang_selected_Value, deepl_selected_Value);
        
    //google 번역기
    const google_selected_Value = target_google_Select.value;
    translateWithGoogle(input_lang, source_lang_selected_Value, google_selected_Value);

    //microsoft 번역기
    const microsoft_selected_Value = target_microsoft_Select.value;
    //console.log(detectLanguageWithMicrosoftAzure(input_lang));
    translateWithMicrosoft(input_lang, source_lang_selected_Value, microsoft_selected_Value);
});

// target_deepl_Select의 값이 변경될 때마다 번역
target_deepl_Select.addEventListener('change', (e) => {
    const input_lang = input_Text.value;
    const source_lang_selected_Value = source_lang_Select.value;
    const selectedValue = e.target.value;
    if(input_lang == ''){
        return;
    }
    translateWithDeepL(input_lang, source_lang_selected_Value, selectedValue);
});

//target_google_Select의 값이 변경될 때마다 번역
target_google_Select.addEventListener('change', (e) => {
    const input_lang = input_Text.value;
    const source_lang_selected_Value = source_lang_Select.value;
    const selectedValue = e.target.value;
    if(input_lang == ''){
        return;
    }
    translateWithGoogle(input_lang, source_lang_selected_Value, selectedValue);
});

//target_microsoft_Select의 값이 변경될 때마다 번역
target_microsoft_Select.addEventListener('change', (e) => {
    const input_lang = input_Text.value;
    const source_lang_selected_Value = source_lang_Select.value;
    const selectedValue = e.target.value;
    if(input_lang == ''){
        return;
    }
    translateWithMicrosoft(input_lang, source_lang_selected_Value, selectedValue);
});

