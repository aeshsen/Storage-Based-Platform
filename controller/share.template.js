export const template = (data,token) => {
  const { useremail, Username, sendername, filename, filepath } = data;
  const downloadLink = `${process.env.DOMAINNAME}/api/downold?token=${token}`;

  return `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">
      <h2 style="color: #007bff;">📎 ShareKing - You've Received a File</h2>

      <p>Hi <strong>${sendername}</strong>,</p>

      <p><strong>${Username}</strong> (<a href="mailto:${useremail}">${useremail}</a>) has shared a file with you via <strong>ShareKing</strong>.</p>

      <p><strong>File Name:</strong> ${filename}</p>

      <p style="margin-top: 20px;">Click the button below to download your file:</p>
      <a href="${downloadLink}" style="
          display: inline-block;
          margin: 10px 0;
          padding: 12px 24px;
          background-color: #28a745;
          color: white;
          font-weight: bold;
          text-decoration: none;
          border-radius: 6px;
          transition: background-color 0.3s ease;
        " target="_blank">
        ⬇️ Download File
      </a>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

      <p style="font-size: 14px; color: #555;">This file was shared with: <strong>${useremail}</strong></p>

      <p style="font-size: 12px; color: #888;">If you did not expect this email, please ignore it or contact ShareKing support.</p>

      <p style="margin-top: 30px; font-size: 14px;">Thanks,<br><strong>Team ShareKing</strong></p>
    </div>
  </body>
</html>
`;
};
