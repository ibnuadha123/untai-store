// Your real payment details go here. Since payment is verified manually
// (see checkout.sql — orders start as PENDING and you mark them PAID
// yourself after checking your merchant account), this is just static
// business info, not anything wired to a payment gateway API.

export const paymentInfo = {
  qris: {
    // Replace this with your real QRIS code image, exported from your bank
    // or e-wallet provider's merchant dashboard. Put the file in
    // public/images/ and update this path. PNG or JPG both work.
    imagePath: "/images/Qr.jpg",
    isPlaceholder: false,
  },
  dana: {
    number: "0882-0181-26521", // TODO: replace with your real DANA number
    accountName: "Friska Fadilah Simatupang", // TODO: replace with the registered name
  },
};
