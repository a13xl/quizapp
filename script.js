let questionNr = 0;
let rightAnswer = 0;
let AUDIO_SUCCESS = new Audio('./audio/success.mp3');
let AUDIO_FAIL = new Audio('./audio/Zonk-sound.mp3');

async function init() {
    await includeHTML();
    document.getElementById('lastSite').innerHTML = questions.length;
    document.getElementById('lastSiteInfo').innerHTML = questions.length;
    showQuestion();
    showAnswer();
    updateProgressbar();
}

function showQuestion() {
    let question = questions[questionNr];

    document.getElementById('question').innerHTML = question.question;
    document.getElementById('currentSite').innerHTML = questionNr + 1;
    document.getElementById('currentSiteInfo').innerHTML = questionNr + 1;
}

function showAnswer() {
    let question = questions[questionNr];
    let answer = document.getElementById('answer');
    answer.innerHTML = '';

    for(i=0; i < question.answers.length; i++) {
        answer.innerHTML += answerTemplate(question, i);
    }
}

function answerTemplate(question, answerNr) {
    let answerRealNr = answerNr + 1;
    return `
        <div id="answer${answerRealNr}" class="card-body card-answer-option card-answer-option-hover rounded" onclick="answer(${questionNr}, ${answerRealNr})">
            ${question.answers[answerNr]}
        </div>`;
}

// Click on Answer
function answer(qstNr ,answerNr) {
    disableAnswers();

    if(answerNr == questions[qstNr].right_answer) { // richtige Antwort
        answerRight(answerNr);
    } else { // falsche Antwort
        answerFalse(answerNr, qstNr);
    }

    document.getElementById('nextQuestion').disabled = false; // Button nächste Frage aktivieren
    document.getElementById('answerInfoBtn').style = '';
}

function answerRight(answerNr) {
    rightAnswer++;
    document.getElementById(`answer${answerNr}`).classList.add('bg-success');
    AUDIO_SUCCESS.play();
    AUDIO_SUCCESS.volume = 0.6;
}

function answerFalse(answerNr, qstNr) {
    document.getElementById(`answer${answerNr}`).classList.add('bg-danger');
    document.getElementById(`answer${questions[qstNr].right_answer}`).classList.add('bg-success');
    AUDIO_FAIL.play();
    AUDIO_FAIL.volume = 0.3;
}

function disableAnswers() {
    for(i = 0; i < questions[questionNr].answers.length; i++) {
        let x = i + 1;
        let answer = document.getElementById(`answer${x}`);

        answer.removeAttribute('onclick');
        answer.classList.remove('card-answer-option-hover');
    }
}

// next question if not last. Else go to End Card
function nextQuestion() {
    questionNr++;

    if(questionNr >= questions.length){
        updateProgressbar();
        opnEndScreen();
    } else {
        document.getElementById('nextQuestion').disabled = true;
        document.getElementById('answerInfoBtn').style = 'display: none;';
        checkResultBtn();
        init();
    }
}

function updateProgressbar() {
    let progressBar = document.getElementById('progressBar');
    let progress = (questionNr) / questions.length * 100;
    progress = Math.round(progress);
    progressBar.innerHTML = `${progress}%`;
    progressBar.style = `width: ${progress}%;`;
}

function checkResultBtn() {
    if(questionNr == (questions.length - 1)){
        document.getElementById('nextQuestion').innerHTML = 'Ergebnis';
		document.getElementById('nextQuestionInfo').innerHTML = 'Ergebnis';
    }
}

// ========== ANSWER INFO ==========
function openInfo() {
    document.getElementById('questionCard').style = 'display: none';
    document.getElementById('infoCard').style = '';
    document.getElementById('answerInfo').innerHTML = questions[questionNr].answerDescription;
}

function closeInfo() {
    document.getElementById('infoCard').style = 'display: none;';
    document.getElementById('questionCard').style = '';
}

function nextQuestionInfo() {
    closeInfo();
    nextQuestion();
}

// ========== ENDSCREEN ==========
function opnEndScreen() {
    opnEndCard();
    endResult();
}

function opnEndCard() {
    document.getElementById('questionCard').style = 'display: none';
    document.getElementById('endCard').style = '';
}

function endResult() {
    document.getElementById('endResult').innerHTML = `<br>Du hast ${rightAnswer}<br>von ${questions.length}<br>Fragen richtig.`;
}

function home() {
    questionNr = 0;
    rightAnswer = 0;
    window.location = './index.html';
}

// ========== IMPRESSUM ==========
function opnImpressum() {
    document.getElementById('impressum').style = '';
}

function closeImpressum() {
    document.getElementById('impressum').style = 'display: none';
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute('w3-include-html');
        let resp = await fetch(file);
        if(resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found.';
        }
    }
}