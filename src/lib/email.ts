import { Resend } from "resend";
import { env } from "~/env.js";

const resend = new Resend(env.RESEND_API_KEY);

export interface ReservationEmailData {
  customerName: string;
  customerEmail: string;
  barbershopName: string;
  barbershopAddress: string;
  barbershopPhone: string;
  serviceName: string;
  servicePrice: number;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

export async function sendReservationConfirmation(data: ReservationEmailData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: "BarberLi <noreply@barberli.ma>",
      to: [data.customerEmail],
      subject: `Confirmation de réservation - ${data.barbershopName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmation de réservation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .reservation-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #555; }
            .value { color: #333; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Réservation confirmée !</h1>
              <p>Merci d'avoir choisi BarberLi</p>
            </div>
            
            <div class="content">
              <p>Bonjour <strong>${data.customerName}</strong>,</p>
              
              <p>Votre réservation a été confirmée avec succès. Voici les détails de votre rendez-vous :</p>
              
              <div class="reservation-details">
                <h3>📅 Détails de la réservation</h3>
                <div class="detail-row">
                  <span class="label">Salon :</span>
                  <span class="value">${data.barbershopName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Adresse :</span>
                  <span class="value">${data.barbershopAddress}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Téléphone :</span>
                  <span class="value">${data.barbershopPhone}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Service :</span>
                  <span class="value">${data.serviceName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Date :</span>
                  <span class="value">${data.appointmentDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Heure :</span>
                  <span class="value">${data.appointmentTime}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Prix :</span>
                  <span class="value"><strong>${data.servicePrice.toFixed(2)} MAD</strong></span>
                </div>
                ${data.notes ? `
                <div class="detail-row">
                  <span class="label">Notes :</span>
                  <span class="value">${data.notes}</span>
                </div>
                ` : ''}
              </div>
              
              <p><strong>Important :</strong></p>
              <ul>
                <li>Veuillez arriver 5 minutes avant votre rendez-vous</li>
                <li>En cas d'empêchement, annulez votre réservation au moins 2 heures à l'avance</li>
                <li>Pour toute question, contactez directement le salon</li>
              </ul>
              
              <div class="footer">
                <p>Merci d'avoir choisi BarberLi pour vos besoins de coiffure !</p>
                <p>L'équipe BarberLi</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send confirmation email");
    }

    return emailData;
  } catch (error) {
    console.error("Error in sendReservationConfirmation:", error);
    throw error;
  }
}

export async function sendReservationCancellation(data: ReservationEmailData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: "BarberLi <noreply@barberli.ma>",
      to: [data.customerEmail],
      subject: `Annulation de réservation - ${data.barbershopName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Annulation de réservation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .reservation-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #555; }
            .value { color: #333; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>❌ Réservation annulée</h1>
              <p>Votre réservation a été annulée</p>
            </div>
            
            <div class="content">
              <p>Bonjour <strong>${data.customerName}</strong>,</p>
              
              <p>Votre réservation a été annulée avec succès. Voici les détails de la réservation annulée :</p>
              
              <div class="reservation-details">
                <h3>📅 Détails de la réservation annulée</h3>
                <div class="detail-row">
                  <span class="label">Salon :</span>
                  <span class="value">${data.barbershopName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Service :</span>
                  <span class="value">${data.serviceName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Date :</span>
                  <span class="value">${data.appointmentDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Heure :</span>
                  <span class="value">${data.appointmentTime}</span>
                </div>
              </div>
              
              <p>Nous espérons vous revoir bientôt chez BarberLi !</p>
              
              <div class="footer">
                <p>L'équipe BarberLi</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending cancellation email:", error);
      throw new Error("Failed to send cancellation email");
    }

    return emailData;
  } catch (error) {
    console.error("Error in sendReservationCancellation:", error);
    throw error;
  }
}
