import { SMTPServer, SMTPServerOptions } from 'smtp-server';
import { Readable } from 'stream';
import axios from 'axios';
import dotenv from 'dotenv';
import { simpleParser } from 'mailparser';

dotenv.config();

const AUTH_USERNAME = process.env.SMTP_AUTH_USERNAME!;
const UNSEND_BASE_URL = process.env.UNSEND_BASE_URL!;
let API_KEY = '';

const ports = [25, 465, 2465, 587, 2587]; // Array of ports to listen on

const serverOptions: SMTPServerOptions = {
  onData(stream: Readable, session: any, callback: (error?: Error) => void) {
    console.log('Receiving email data...'); // Debug statement
    simpleParser(stream, (err, parsed) => {
      if (err) {
        console.error('Failed to parse email data:', err.message);
        return callback(err);
      }

      const emailObject: any = {
        to: Array.isArray(parsed.to) ? parsed.to.map(addr => addr.text).join(', ') : parsed.to?.text,
        from: Array.isArray(parsed.from) ? parsed.from.map(addr => addr.text).join(', ') : parsed.from?.text,
        subject: parsed.subject,
        text: parsed.text,
        html: parsed.html,
      };

      console.log('Parsed email data:', emailObject); // Debug statement

      sendEmailToUnsend(emailObject)
        .then(() => callback())
        .catch((error) => {
          console.error('Failed to send email:', error.message);
          callback(error);
        });
    });
  },
  onAuth(auth: any, session: any, callback: (error?: Error, user?: any) => void) {
    API_KEY = auth.password;
    if (auth.username === AUTH_USERNAME) {
      console.log('Authenticated successfully'); // Debug statement
      callback(undefined, { user: AUTH_USERNAME });
    } else {
      console.error('Invalid username or password');
      callback(new Error('Invalid username or password'));
    }
  },
};

async function sendEmailToUnsend(emailData: any) {
  try {
    const apiEndpoint = '/api/v1/emails';
    const url = new URL(apiEndpoint, UNSEND_BASE_URL); // Combine base URL with endpoint
    console.log('Sending email to Unsend API at:', url.href); // Debug statement

    const response = await axios.post(url.href, emailData, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Unsend API response:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        throw new Error(`Failed to send email: ${error.response.data.message || 'Unknown error from server'}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('Failed to send email: No response received from server');
      } else {
        console.error('Error message:', error.message);
        throw new Error(`Failed to send email: ${error.message}`);
      }
    } else {
      console.error('Unexpected error:', error);
      throw new Error('Failed to send email: Unexpected error occurred');
    }
  }
}

function startServers() {
  ports.forEach(port => {
    const server = new SMTPServer(serverOptions);

    server.listen(port, () => {
      console.log(`SMTP server is listening on port ${port}`);
    });

    server.on('error', (err) => {
      console.error(`Error occurred on port ${port}:`, err);
    });
  });
}

startServers();
