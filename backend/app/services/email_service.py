import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Dict, Any
from app.config import settings

class EmailService:
    def send_job_match_email(self, recipient_email: str, candidate_name: str, matched_jobs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Sends formatted HTML Gmail email notification listing high-relevance job matches.
        Supports live Gmail SMTP delivery or simulation mode with payload logging.
        """
        subject = f"🎯 Career AI: {len(matched_jobs)} New High-Match Jobs for {candidate_name}"
        
        # Build HTML Job List rows
        job_rows_html = ""
        for job in matched_jobs[:5]:
            title = job.get('title', 'Software Developer')
            company = job.get('company', 'Tech Enterprise')
            score = job.get('match_score', 85)
            salary = job.get('salary_range', 'Competitive')
            app_url = job.get('application_url', 'https://career-ai-frontend-tz1o.onrender.com')
            
            job_rows_html += f"""
            <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px 16px;">
                    <div style="font-weight: bold; font-size: 16px; color: #1e293b;">{title}</div>
                    <div style="color: #64748b; font-size: 14px;">🏢 {company} &bull; 💰 {salary}</div>
                </td>
                <td style="padding: 12px 16px; text-align: right;">
                    <span style="background-color: #10b981; color: #ffffff; padding: 4px 10px; border-radius: 12px; font-weight: bold; font-size: 13px;">
                        🎯 {score}% Match
                    </span>
                    <br/>
                    <a href="{app_url}" style="display: inline-block; margin-top: 6px; color: #6366f1; font-weight: bold; font-size: 13px; text-decoration: none;">
                        Apply Now &rarr;
                    </a>
                </td>
            </tr>
            """

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Career AI Job Alerts</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 20px; margin: 0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 24px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 24px;">⚡ Career AI Job Matches</h1>
                    <p style="margin-top: 6px; font-size: 14px; opacity: 0.9;">Tailored Remote Opportunities for {candidate_name}</p>
                </div>
                <div style="padding: 24px;">
                    <p style="font-size: 15px; color: #334155; margin-bottom: 20px;">
                        Hi <strong>{candidate_name}</strong>,<br/>
                        Our AI engine matched <strong>{len(matched_jobs)} new remote openings</strong> aligned with your resume tech skills!
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                        {job_rows_html}
                    </table>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="https://career-ai-frontend-tz1o.onrender.com" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block;">
                            View All Matches on Career AI Dashboard &rarr;
                        </a>
                    </div>
                </div>
                <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
                    You are receiving this email because Gmail job alerts are enabled on Career AI for {recipient_email}.
                </div>
            </div>
        </body>
        </html>
        """

        # Check if live SMTP credentials are configured
        if settings.SMTP_USER and settings.SMTP_PASSWORD:
            try:
                msg = MIMEMultipart("alternative")
                msg["Subject"] = subject
                msg["From"] = settings.SMTP_FROM_EMAIL or settings.SMTP_USER
                msg["To"] = recipient_email
                msg.attach(MIMEText(html_content, "html"))

                with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                    server.starttls()
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                    server.sendmail(msg["From"], recipient_email, msg.as_string())
                
                return {
                    "status": "success",
                    "delivery": "live_smtp",
                    "recipient": recipient_email,
                    "matched_count": len(matched_jobs),
                    "message": f"Email alert successfully dispatched to {recipient_email}"
                }
            except Exception as e:
                print(f"SMTP dispatch notice: {e}")
        
        # Fallback simulation logging mode
        print(f"[GMAIL ALERT SIMULATION] To: {recipient_email} | Subject: {subject} | Jobs Count: {len(matched_jobs)}")
        return {
            "status": "success",
            "delivery": "simulation_logged",
            "recipient": recipient_email,
            "matched_count": len(matched_jobs),
            "message": f"Job alert email simulated for {recipient_email} ({len(matched_jobs)} matched positions)."
        }

email_service = EmailService()
