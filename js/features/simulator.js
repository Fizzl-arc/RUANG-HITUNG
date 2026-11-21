import { formatNumber } from '../utils/format-number.js';

function updateLinearFunction(inputs) {
  const values = inputs.map((input) => input.value.trim() === '' ? NaN : Number(input.value));
  const [a, b, x] = values;
  const substitution = document.getElementById('linearSubstitution');
  const result = document.getElementById('linearResult');
  if (values.some((value) => !Number.isFinite(value))) {
    substitution.textContent = 'Masukkan angka yang valid pada semua kolom.';
    result.textContent = '—';
    return;
  }

  const output = a * x + b;
  substitution.textContent = `f(${formatNumber(x)}) = ${formatNumber(a)} × ${formatNumber(x)} + ${formatNumber(b)}`;
  const formattedOutput = Number.isFinite(output) ? formatNumber(output) : '—';
  if (result.textContent === formattedOutput) return;

  result.textContent = formattedOutput;
  result.classList.remove('value-pulse');
  requestAnimationFrame(() => result.classList.add('value-pulse'));
}

export function initializeSimulator() {
  const inputs = ['linearA', 'linearB', 'linearX'].map((id) => document.getElementById(id));
  inputs.forEach((input) => input.addEventListener('input', () => updateLinearFunction(inputs)));
  document.getElementById('resetSimulator').addEventListener('click', () => {
    ['2', '3', '4'].forEach((value, index) => {
      inputs[index].value = value;
    });
    updateLinearFunction(inputs);
  });
  updateLinearFunction(inputs);
}
