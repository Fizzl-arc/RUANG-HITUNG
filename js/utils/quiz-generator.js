import { QUIZ_QUESTION_COUNT } from '../config.js';

function createQuestion(category, text, correct, distractors, explain) {
  const options = [String(correct), ...distractors.map(String)];
  if (options.length !== 4 || new Set(options).size !== 4) {
    throw new Error(`Pilihan jawaban soal tidak valid: ${text}`);
  }
  return { category, text, options, answer: 0, explain };
}

function createNumericQuestion(category, text, answer, explain) {
  return createQuestion(category, text, answer, [answer + 1, answer - 1, answer + 2], explain);
}

function createBasicEvaluationQuestions(n) {
  const a = 2 + n;
  const b = 3 + n;
  const x = 1 + n;
  const domain = [1 + n, 2 + n, 3 + n];
  const range = domain.map((value) => value + b);
  const secondX = 2 + n;
  const secondA = 3 + n;
  const solveX = 4 + n;
  const solveB = 2 + n;
  const solveTarget = 2 * solveX + solveB;

  return [
    createNumericQuestion('DASAR / SUBSTITUSI', `Jika f(x) = ${a}x + ${b}, hitung f(${x}).`, a * x + b, `Substitusikan x=${x}: f(${x})=${a}(${x})+${b}=${a * x + b}.`),
    createNumericQuestion('DASAR / NILAI FUNGSI', `Jika g(x)=x+${b}, hitung g(${secondX}).`, secondX + b, `Substitusikan x=${secondX}: g(${secondX})=${secondX}+${b}=${secondX + b}.`),
    createNumericQuestion('DASAR / MENENTUKAN INPUT', `Jika h(x)=2x+${solveB} dan h(x)=${solveTarget}, tentukan x.`, solveX, `2x+${solveB}=${solveTarget}, sehingga 2x=${solveTarget - solveB} dan x=${solveX}.`),
    createQuestion('DASAR / MENGHITUNG RANGE', `Untuk f(x)=x+${b} dengan domain {${domain.join(', ')}}, berapa range-nya?`, `{${range.join(', ')}}`, [`{${range.join(', ')}, ${range[2] + 2}}`, `{${domain.join(', ')}}`, `{${domain.map((value) => 2 * value).join(', ')}}`], `Hitung tiap output: ${domain.map((value) => `f(${value})=${value}+${b}=${value + b}`).join(', ')}. Jadi range = {${range.join(', ')}}.`),
    createNumericQuestion('DASAR / OPERASI LINEAR', `Jika p(x)=${secondA}x+1, hitung p(${x}).`, secondA * x + 1, `Substitusikan x=${x}: p(${x})=${secondA}(${x})+1=${secondA * x + 1}.`)
  ];
}

function createBasicApplicationQuestions(n) {
  const linearA = 2 + n;
  const linearB = 1 + n;
  const linearX = 3 + n;
  const linearOutput = linearA * linearX + linearB;
  const constantOutput = 5 + n;
  const constantX = 2 + n;
  const sumX = 2 + n;
  const sumOutput = (sumX + 1) + (sumX + 2);
  const addA = 4 + n;
  const addB = 3 + n;
  const addX = 1 + n;
  const squareX = 2 + n;
  const squareOutput = squareX ** 2;

  return [
    createNumericQuestion('DASAR / SUBSTITUSI LINEAR', `Jika p(x)=${linearA}x+${linearB}, hitung p(${linearX}).`, linearOutput, `p(${linearX})=${linearA}(${linearX})+${linearB}=${linearOutput}.`),
    createNumericQuestion('DASAR / FUNGSI KONSTANTA', `Jika r(x)=${constantOutput}, hitung r(${constantX}).`, constantOutput, `Fungsi konstan menghasilkan nilai yang sama untuk setiap input, jadi r(${constantX})=${constantOutput}.`),
    createNumericQuestion('DASAR / JUMLAH NILAI', `Jika f(x)=x+1 dan g(x)=x+2, hitung f(${sumX})+g(${sumX}).`, sumOutput, `f(${sumX})=${sumX + 1} dan g(${sumX})=${sumX + 2}; jumlahnya ${sumOutput}.`),
    createNumericQuestion('DASAR / PENJUMLAHAN FUNGSI', `Jika f(x)=${addA} dan g(x)=${addB}, hitung f(${addX})+g(${addX}).`, addA + addB, `Kedua fungsi bernilai konstan, jadi ${addA}+${addB}=${addA + addB}.`),
    createNumericQuestion('DASAR / KUADRAT SEDERHANA', `Hitung ${squareX}².`, squareOutput, `${squareX}×${squareX}=${squareOutput}.`)
  ];
}

function createIntermediateCompositionQuestions(n) {
  const composeA = 2 + n;
  const composeB = 1 + n;
  const innerOffset = 2 + n;
  const input = 2 + n;
  const compositeValue = composeA * (input + innerOffset) + composeB;
  const productX = 1 + n;
  const productF = productX + 1 + n;
  const productG = 2 * productX + 2 + n;
  const outerB = 1 + n;
  const outerC = 2 + n;
  const compositeConstant = 3 * outerB + outerC;
  const quadraticInput = 1 + n;
  const quadraticInner = quadraticInput ** 2 + n;
  const quadraticComposite = 2 * quadraticInner + 1;

  return [
    createNumericQuestion('MENENGAH / KOMPOSISI NILAI', `Jika f(x)=${composeA}x+${composeB} dan g(x)=x+${innerOffset}, hitung (f ∘ g)(${input}).`, compositeValue, `g(${input})=${input + innerOffset}, lalu f(${input + innerOffset})=${compositeValue}.`),
    createNumericQuestion('MENENGAH / OPERASI FUNGSI', `Jika f(x)=x+${1 + n} dan g(x)=2x+${2 + n}, hitung (fg)(${productX}).`, productF * productG, `f(${productX})=${productF} dan g(${productX})=${productG}; maka (fg)(${productX})=${productF}×${productG}=${productF * productG}.`),
    createQuestion('MENENGAH / KOMPOSISI ALJABAR', `Jika f(x)=2x+${outerB} dan g(x)=3x+${outerC}, bentuk (g ∘ f)(x) adalah…`, `6x + ${compositeConstant}`, [`6x + ${3 * outerB - outerC}`, `5x + ${compositeConstant}`, `6x + ${outerB + outerC}`], `g(f(x))=3(2x+${outerB})+${outerC}=6x+${compositeConstant}.`),
    createNumericQuestion('MENENGAH / KOMPOSISI KUADRAT', `Jika f(x)=2x+1 dan g(x)=x²+${n}, hitung (f ∘ g)(${quadraticInput}).`, quadraticComposite, `g(${quadraticInput})=${quadraticInner}; f(${quadraticInner})=2(${quadraticInner})+1=${quadraticComposite}.`),
    createNumericQuestion('MENENGAH / MENYELESAIKAN KOMPOSISI', `Jika f(x)=2x+${n} dan g(x)=3x+${n + 1}, tentukan x jika (g ∘ f)(x)=${10 * n + 13}.`, n + 2, `g(f(x))=3(2x+${n})+${n + 1}=6x+${4 * n + 1}. Jadi 6x+${4 * n + 1}=${10 * n + 13}, sehingga x=${n + 2}.`)
  ];
}

function createIntermediateInverseQuestions(n) {
  const inverseA = 3 + n;
  const inverseB = 2 + n;
  const inverseX = 4 + n;
  const inverseTarget = inverseA * inverseX + inverseB;
  const quotientA = 4 + n;
  const quotientX = 2 + n;
  const quotientDenominator = quotientX + n + 1;
  const quotientNumerator = quotientA * quotientDenominator;
  const inverseValueA = 2 + n;
  const inverseValueB = 3 + n;
  const inverseValueX = 5 + n;
  const inverseValueTarget = inverseValueA * inverseValueX + inverseValueB;
  const differenceX = 3 + n;
  const difference = differenceX ** 2 - (n + 1) ** 2;

  return [
    createQuestion('MENENGAH / MENENTUKAN INVERS', `Jika f(x)=${inverseA}x+${inverseB}, pilih f⁻¹(x).`, `(x − ${inverseB}) / ${inverseA}`, [`(x + ${inverseB}) / ${inverseA}`, `(x − ${inverseA}) / ${inverseB}`, `${inverseA}x − ${inverseB}`], `Tulis y=${inverseA}x+${inverseB}, tukar x dan y, lalu isolasi y. Hasilnya f⁻¹(x)=(x−${inverseB})/${inverseA}.`),
    createNumericQuestion('MENENGAH / NILAI INVERS', `Jika f(x)=${inverseA}x+${inverseB}, hitung f⁻¹(${inverseTarget}).`, inverseX, `f⁻¹(y)=(y−${inverseB})/${inverseA}; hasilnya ${inverseX}.`),
    createNumericQuestion('MENENGAH / HASIL BAGI FUNGSI', `Jika f(x)=${quotientA}x+${quotientA * (n + 1)} dan g(x)=x+${n + 1}, hitung (f/g)(${quotientX}).`, quotientA, `f(${quotientX})=${quotientNumerator} dan g(${quotientX})=${quotientDenominator}; hasil baginya ${quotientA}.`),
    createNumericQuestion('MENENGAH / NILAI FUNGSI INVERS', `Jika h(x)=${inverseValueA}x+${inverseValueB}, hitung h⁻¹(${inverseValueTarget}).`, inverseValueX, `h⁻¹(y)=(y−${inverseValueB})/${inverseValueA}; hasilnya ${inverseValueX}.`),
    createNumericQuestion('MENENGAH / SELISIH KUADRAT', `Hitung (${differenceX})²−(${n + 1})².`, difference, `Gunakan selisih kuadrat atau hitung langsung: ${differenceX ** 2}−${(n + 1) ** 2}=${difference}.`)
  ];
}

function createChallengeLinearQuestions(n) {
  const slope = 2 + n;
  const intercept = 3 + n;
  const firstX = 1 + n;
  const secondX = firstX + 2;
  const targetX = secondX + 1;
  const firstY = slope * firstX + intercept;
  const secondY = slope * secondX + intercept;
  const targetY = slope * targetX + intercept;
  const costRate = 500 * (5 + n);
  const costBase = 1000 * (2 + n);
  const distance = 3 + n;
  const cost = costRate * distance + costBase;
  const lineSlope = 3 + n;
  const lineIntercept = 2 + n;
  const lineFirstX = 1 + n;
  const lineSecondX = lineFirstX + 3;
  const lineFirstY = lineSlope * lineFirstX + lineIntercept;
  const lineSecondY = lineSlope * lineSecondX + lineIntercept;
  const inverseA = 2 + n;
  const inverseB = 1 + n;
  const inverseX = 3 + n;
  const inverseTarget = inverseA * inverseX - inverseB;

  return [
    createNumericQuestion('TANTANGAN / FUNGSI LINEAR', `Garis melalui (${firstX}, ${firstY}) dan (${secondX}, ${secondY}). Berapa f(${targetX})?`, targetY, `Gradien a=(${secondY}−${firstY})/(${secondX}−${firstX})=${slope}. Dari salah satu titik, b=${intercept}. Maka f(${targetX})=${targetY}.`),
    createNumericQuestion('TANTANGAN / MODEL BIAYA', `Biaya C(d)=${costRate}d+${costBase}. Berapa biaya untuk ${distance} satuan?`, cost, `C(${distance})=${costRate}(${distance})+${costBase}=${cost}.`),
    createNumericQuestion('TANTANGAN / GRADIEN GARIS', `Garis melalui (${lineFirstX}, ${lineFirstY}) dan (${lineSecondX}, ${lineSecondY}). Tentukan gradiennya.`, lineSlope, `a=(${lineSecondY}−${lineFirstY})/(${lineSecondX}−${lineFirstX})=${lineSlope}.`),
    createNumericQuestion('TANTANGAN / INVERS LINEAR', `Jika f(x)=${inverseA}x−${inverseB}, hitung f⁻¹(${inverseTarget}).`, inverseX, `f⁻¹(y)=(y+${inverseB})/${inverseA}; hasilnya ${inverseX}.`),
    createNumericQuestion('TANTANGAN / FUNGSI KUADRAT', `Jika p(x)=x²+${n}, hitung p(${n + 4}).`, (n + 4) ** 2 + n, `p(${n + 4})=(${n + 4})²+${n}=${(n + 4) ** 2 + n}.`)
  ];
}

function createChallengeMixedQuestions(n) {
  const composeA = 2 + n;
  const composeB = 1 + n;
  const innerA = 1 + n;
  const innerB = 2 + n;
  const composeX = 2 + n;
  const composedValue = composeA * (innerA * composeX + innerB) + composeB;
  const shift = 1 + n;
  const root = 2 + n;
  const equationX = 4 + n;
  const equationB = 1 + n;
  const equationC = 2 + n;
  const equationTarget = 3 * (2 * equationX + equationB) + equationC;
  const rangeDomain = [n + 1, n + 2, n + 3];
  const rangeValues = rangeDomain.map((value) => value ** 2 + n);
  const multiX = n + 1;
  const multiY = n + 2;
  const multiOutput = (n + 2) * multiX + (n + 3) * multiY;

  return [
    createNumericQuestion('TANTANGAN / KOMPOSISI', `Jika f(x)=${composeA}x+${composeB}, g(x)=${innerA}x+${innerB}, hitung (f ∘ g)(${composeX}).`, composedValue, `g(${composeX})=${innerA * composeX + innerB}; f(${innerA * composeX + innerB})=${composedValue}.`),
    createNumericQuestion('TANTANGAN / INVERS KUADRAT', `Jika f(x)=(x−${shift})² dengan domain x≥${shift}, berapa f⁻¹(${root ** 2})?`, shift + root, `f⁻¹(y)=${shift}+√y. Jadi f⁻¹(${root ** 2})=${shift}+${root}=${shift + root}.`),
    createNumericQuestion('TANTANGAN / PERSAMAAN KOMPOSISI', `Jika f(x)=2x+${equationB}, g(x)=3x+${equationC}, dan (g ∘ f)(x)=${equationTarget}, tentukan x.`, equationX, `g(f(x))=6x+${3 * equationB + equationC}. Selesaikan persamaan itu, diperoleh x=${equationX}.`),
    createQuestion('TANTANGAN / RANGE KUADRAT', `Jika q(x)=x²+${n} dengan domain {${rangeDomain.join(', ')}}, tentukan range q.`, `{${rangeValues.join(', ')}}`, [`{${rangeDomain.join(', ')}}`, `{${rangeValues.join(', ')}, ${rangeValues[2] + 2}}`, `{${rangeDomain.map((value) => 2 * value + n).join(', ')}}`], `Hitung q(${rangeDomain[0]})=${rangeValues[0]}, q(${rangeDomain[1]})=${rangeValues[1]}, q(${rangeDomain[2]})=${rangeValues[2]}.`),
    createNumericQuestion('TANTANGAN / FUNGSI DUA VARIABEL', `Jika F(x,y)=${n + 2}x+${n + 3}y, hitung F(${multiX}, ${multiY}).`, multiOutput, `F(${multiX},${multiY})=${n + 2}(${multiX})+${n + 3}(${multiY})=${multiOutput}.`)
  ];
}

export function generateQuizQuestions(levelId, attemptNumber) {
  const n = Math.max(0, attemptNumber - 1);
  let questions;
  if (levelId === 1) questions = [...createBasicEvaluationQuestions(n), ...createBasicApplicationQuestions(n)];
  else if (levelId === 2) questions = [...createIntermediateCompositionQuestions(n), ...createIntermediateInverseQuestions(n)];
  else if (levelId === 3) questions = [...createChallengeLinearQuestions(n), ...createChallengeMixedQuestions(n)];
  else throw new Error(`Level kuis tidak dikenal: ${levelId}`);

  if (questions.length !== QUIZ_QUESTION_COUNT) {
    throw new Error(`Level ${levelId} harus memiliki ${QUIZ_QUESTION_COUNT} soal.`);
  }
  return questions;
}
