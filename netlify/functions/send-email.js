const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Parse the request body
  const { name, email, phone, message } = JSON.parse(event.body || '{}');

  // Basic validation
  if (!name || !email || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields: name, email, or message' }),
    };
  }

  // Prepare the email payload for Resend API
  const payload = {
    from: 'Pack Recommender <onboarding@resend.dev>', // or your verified sender
    to: 'your@email.com', // ✅ Replace with your destination email
    subject: `New contact form submission from ${name}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: data.id }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
