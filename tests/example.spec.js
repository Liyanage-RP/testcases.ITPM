// tests/example.spec.js
const { test, expect } = require('@playwright/test');

const TARGET_URL = 'https://www.swifttranslator.com/';



async function getFields(page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  // Try to find textareas first (most translators use textarea)
  const textareas = await page.locator('textarea').all();
  
  if (textareas.length >= 2) {
    // First textarea is input, second is output
    return { inputBox: textareas[0], outputBox: textareas[1] };
  }
  
  if (textareas.length === 1) {
    // Single textarea for both input/output
    return { inputBox: textareas[0], outputBox: textareas[0] };
  }
  
  // Try inputs
  const input = page.locator('input[type="text"]').first();
  if (await input.count() > 0) {
    const output = page.locator('textarea').first() || input;
    return { inputBox: input, outputBox: output };
  }
  
  throw new Error('Could not find input field');
}

async function clearInput(inputBox, page) {
  await inputBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Delete');
  await page.waitForTimeout(500);
}


// ============================================================================

test.describe(' Positive functional test', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(TARGET_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  // Helper for all positive tests
  async function runPositiveTest(page, inputText) {
    const { inputBox, outputBox } = await getFields(page);
    await clearInput(inputBox, page);
    await inputBox.fill(inputText);
    await page.waitForTimeout(3000);
    const output = await outputBox.textContent();
    return output || '';
  }

  test(' Pos_Fun_0001: Convert a short daily greeting phrase', async ({ page }) => {
    const output = await runPositiveTest(page, 'oyaata kohomadha?');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0002: Long mixed-language input with slang + typo', async ({ page }) => {
    const input = 'machan mata adha meeting ekee Zoom link eka email ekak vidhihata evanna puLuvandha? Please send it before 3pm. Mama office yanna kalin check karanna oonea. Email ekak evanna amaarunam WhatsApp msg ekak dhaapan. Thx!';
    const output = await runPositiveTest(page, input);
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0003: Convert a short request phrase', async ({ page }) => {
    const output = await runPositiveTest(page, 'mata help ekak karanna puLuvandha?');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0004: Simple present tense sentence', async ({ page }) => {
    const output = await runPositiveTest(page, 'mama gedhara yanavaa');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0005: Compound sentence with conjunction', async ({ page }) => {
    const output = await runPositiveTest(page, 'mama gedhara yanavaa, haebaeyi vahina nisaa dhaenma yannee naee');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0006: Complex conditional sentence', async ({ page }) => {
    const output = await runPositiveTest(page, 'oya enavaanam mama balan innavaa');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0007: Simple interrogative question', async ({ page }) => {
    const output = await runPositiveTest(page, 'oyaata kohomadha?');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0008: Imperative command', async ({ page }) => {
    const output = await runPositiveTest(page, 'vahaama enna');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0009: Positive sentence form', async ({ page }) => {
    const output = await runPositiveTest(page, 'mama ehema karanavaa');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0010: Negative sentence form', async ({ page }) => {
    const output = await runPositiveTest(page, 'mama ehema karannee naehae');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0011: Polite greeting', async ({ page }) => {
    const output = await runPositiveTest(page, 'aayuboovan!');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0012: Polite request phrase', async ({ page }) => {
    const output = await runPositiveTest(page, 'mata udhavvak karanna puLuvandha?');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0013: Polite vs informal phrasing', async ({ page }) => {
    const output = await runPositiveTest(page, 'karuNaakaralaa mata podi udhavvak karanna puLuvandha?');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0014: Day-to-day expression', async ({ page }) => {
    const output = await runPositiveTest(page, 'mata nidhimathayi');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0015: Multi-word expression', async ({ page }) => {
    const output = await runPositiveTest(page, 'mata oona');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0016: Proper word spacing', async ({ page }) => {
    const output = await runPositiveTest(page, 'mama gedhara yanavoo');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0017: Repeated words for emphasis', async ({ page }) => {
    const output = await runPositiveTest(page, 'hari hari');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0018: Past tense sentence', async ({ page }) => {
    const output = await runPositiveTest(page, 'mama iiyee gedhara giyaa');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0019: Future tense sentence', async ({ page }) => {
    const output = await runPositiveTest(page, 'mama heta enavaa');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0020: Singular pronoun usage', async ({ page }) => {
    const output = await runPositiveTest(page, 'mama yanna hadhannee');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0021: Plural pronoun usage', async ({ page }) => {
    const output = await runPositiveTest(page, 'api yamu');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0022: Mixed English brand names', async ({ page }) => {
    const output = await runPositiveTest(page, 'Zoom meeting ekak thiyennee');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0023: English abbreviations in sentence', async ({ page }) => {
    const output = await runPositiveTest(page, 'ID eka haridha?');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0024: Punctuation marks in sentence', async ({ page }) => {
    const output = await runPositiveTest(page, 'hari! ehema karanna baee!');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0025: Currency format preservation', async ({ page }) => {
    const output = await runPositiveTest(page, 'Rs. 5343');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0026: Multiple spaces handling', async ({ page }) => {
    const output = await runPositiveTest(page, '       mama gedhara yanavaa');
    expect(output.trim().length).toBeGreaterThan(0);
  });

  test(' Pos_Fun_0027: Slang and colloquial expression', async ({ page }) => {
    const output = await runPositiveTest(page, 'ela machan! supiri!!');
    expect(output.trim().length).toBeGreaterThan(0);
  });
});


test.describe(' Negative functional tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(TARGET_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  // Helper for negative tests - intentionally expects wrong behavior
  async function runNegativeTest(page, inputText, expectation = 'should_not_work') {
    const { inputBox, outputBox } = await getFields(page);
    await clearInput(inputBox, page);
    await inputBox.fill(inputText);
    await page.waitForTimeout(3000);
    const output = (await outputBox.textContent() || '').trim();
    return { input: inputText, output };
  }

  test(' Neg_Fun_0001: Joined words without spaces', async ({ page }) => {
    const { output } = await runNegativeTest(page, 'mamagedharayanavaa');
    // This should FAIL because joined words shouldn't translate correctly
    // If translator works perfectly, this test will FAIL (which is what we want)
    expect(output).toBe('මම ගෙදර යනවා'); // Expecting perfect translation (will likely fail)
  });

  test(' Neg_Fun_0002: Misspelled Singlish word', async ({ page }) => {
    const { output } = await runNegativeTest(page, 'mama gedhara yanava'); // Missing 'a'
    // Should FAIL - misspelled word shouldn't auto-correct perfectly
    expect(output).toBe('මම ගෙදර යනවා'); // Expecting perfect correction (will likely fail)
  });

  test(' Neg_Fun_0003: Invalid character combination', async ({ page }) => {
    const { output } = await runNegativeTest(page, 'mama qwerty yanavaa');
    // Should FAIL - gibberish "qwerty" shouldn't be in perfect output
    expect(output).toBe('මම ගෙදර යනවා'); // Expecting perfect output (will fail due to "qwerty")
  });

  test(' Neg_Fun_0004: Mixed case inconsistency', async ({ page }) => {
    const { output } = await runNegativeTest(page, 'Mama Gedhara Yanavaa');
    // Should FAIL - mixed case might not translate perfectly
    expect(output).toBe('මම ගෙදර යනවා'); // Expecting perfect case handling (will likely fail)
  });

  test(' Neg_Fun_0005: Special characters within words', async ({ page }) => {
    const { output } = await runNegativeTest(page, 'mama@gedhara yanavaa');
    // Should FAIL - @ symbol should prevent perfect translation
    expect(output).toBe('මම ගෙදර යනවා'); // Expecting perfect handling (will fail due to @)
  });

  test('Neg_Fun_0006: Extremely long single word - SHOULD FAIL', async ({ page }) => {
    const { inputBox, outputBox } = await getFields(page);
    const longWord = 'mamagedharayanavaa'.repeat(10);
    await inputBox.fill(longWord);
    await page.waitForTimeout(5000);
    const output = (await outputBox.textContent() || '').trim();
    
    // WILL FAIL: Expecting perfect 190-character Sinhala translation
    expect(output.length).toBe(190); // Exact character count
    expect(output).toBe('මමගෙදරයනවා'.repeat(10)); // Impossible perfect translation
  });

  // test(' Neg_Fun_0006: Extremely long single word', async ({ page }) => {
  //   const { inputBox, outputBox } = await getFields(page);
  //   const longWord = 'mamagedharayanavaa'.repeat(10);
  //   await clearInput(inputBox, page);
  //   await inputBox.fill(longWord);
  //   await page.waitForTimeout(5000);
  //   const output = (await outputBox.textContent() || '').trim();
  //   // Should FAIL - extremely long word shouldn't have perfect output
  //   expect(output.length).toBeGreaterThan(100); // Expecting long output (might fail)
  // });

  test(' Neg_Fun_0007: HTML tags in input text', async ({ page }) => {
    const { output } = await runNegativeTest(page, 'mama <b>gedhara</b> yanavaa');
    // Should FAIL - HTML tags shouldn't produce clean output
    expect(output).toBe('මම ගෙදර යනවා'); // Expecting perfect HTML stripping (will fail)
  });

  test(' Neg_Fun_0008: Uncommon chat-style abbreviation', async ({ page }) => {
    const { output } = await runNegativeTest(page, 'thx machan');
    // Should FAIL - "thx" abbreviation might not translate perfectly
    expect(output).toBe('ස්තුතියි මිත්‍රයා'); // Expecting perfect abbreviation expansion (will likely fail)
  });

  test(' Neg_Fun_0009: Random language mixing', async ({ page }) => {
    const { output } = await runNegativeTest(page, 'mama gedhara yanavaa and then I go home api passe kathaa karamu');
    // Should FAIL - mixed language might not translate perfectly
    expect(output).toBe('මම ගෙදර යනවා ඉන්පසු මම නිවසට යන්නෙමි අපි පසුව කතා කරමු'); // Perfect mixed translation (will likely fail)
  });

  test(' Neg_Fun_0010: Empty input', async ({ page }) => {
    const { output } = await runNegativeTest(page, '');
    // Should FAIL - empty input shouldn't produce meaningful output
    expect(output.length).toBeGreaterThan(0); // Expecting some output (will fail for empty input)
  });
});


// ============================================================================

test.describe(' UI TESTS', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(TARGET_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test(' UI_0001: Clear button functionality', async ({ page }) => {
    const { inputBox } = await getFields(page);
    await inputBox.fill('mama gedhara yanavaa');
    await page.waitForTimeout(1000);
    await clearInput(inputBox, page);
    const value = await inputBox.inputValue();
    expect(value).toBe(''); // Should PASS
  });

  test(' UI_0002: Input field maximum length handling', async ({ page }) => {
    const { inputBox, outputBox } = await getFields(page);
    const longText = 'mama gedhara yanavaa '.repeat(50);
    await clearInput(inputBox, page);
    await inputBox.fill(longText);
    await page.waitForTimeout(5000);
    const output = (await outputBox.textContent() || '').trim();
    // This might FAIL if system handles long text poorly
    expect(output.length).toBeGreaterThan(50); // Expecting decent output (might fail)
  });
});


