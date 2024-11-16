import { jsPDF } from "jspdf"; // Import jsPDF

export async function generateTransactionPDF() {
    const token = localStorage.getItem("token");

    try {
        // Fetch transaction data
        const response = await fetch("http://localhost:8000/transaction-report", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        if (!response.ok) {
            throw new Error("Failed to fetch transactions");
        }

        const transactions = await response.json();

        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Transaction Report", 10, 20);

        doc.setFontSize(12);
        let yPosition = 30;
        doc.text("Transaction ID", 10, yPosition);
        doc.text("User ID", 40, yPosition);
        doc.text("Patient ID", 60, yPosition);
        doc.text("Timestamp", 90, yPosition);
        doc.text("Payment Method", 130, yPosition);

        yPosition += 10;

        transactions.forEach((transaction) => {
            doc.text(transaction.id.toString(), 10, yPosition);
            doc.text(transaction.user_id.toString(), 40, yPosition);
            doc.text(transaction.patient_id ? transaction.patient_id.toString() : "N/A", 60, yPosition);
            doc.text(new Date(transaction.timestamp).toLocaleString(), 90, yPosition);
            doc.text(transaction.payment_method, 130, yPosition);
            yPosition += 10;
        });

        doc.save("transaction_report.pdf");
    } catch (error) {
        console.error("Error generating transaction report:", error);
    }
}