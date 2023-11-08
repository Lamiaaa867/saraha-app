
import  QRCode  from "qrcode";
export const generateQrCode=({data=''}={})=>{
const qrcode=QRCode.toDataURL(JSON.stringify (data),{
    errorCorrectionLevel:'H'
})
return qrcode
}