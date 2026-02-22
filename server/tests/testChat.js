const testChat = async () => {
    const baseURL = 'http://localhost:5000/api/ai/chat';

    const testCases = [
        { msg: 'Hello', expect: 'Namaste' },
        { msg: 'What are the SLAs?', expect: 'Standard SLAs' },
        { msg: 'Check status of #999', expect: 'couldn\'t find' }
    ];

    console.log('--- Testing Sahayak AI Chat ---');

    for (const test of testCases) {
        try {
            const response = await fetch(baseURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: test.msg,
                    context: { role: 'Guest' }
                })
            });

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

            const data = await response.json();
            const passed = data.text.includes(test.expect) || data.text.includes(test.expect.split(' ')[0]);
            console.log(`[${passed ? 'PASS' : 'FAIL'}] Input: "${test.msg}" \n       -> Response: "${data.text.substring(0, 50)}..."`);
        } catch (error) {
            console.error(`[ERROR] Input: "${test.msg}" -> ${error.message}`);
        }
    }
};

testChat();
