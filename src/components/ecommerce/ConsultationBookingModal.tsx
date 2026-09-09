import { useState } from "react";
import { useECommerce } from "@/lib/ecommerce-context";

const DOCTORS = [
  { id: "d1", name: "Dr. Meenal Joshi, BNYS", role: "Chief Naturopath", exp: "18+ Yrs Exp" },
  { id: "d2", name: "Dr. Aditya Rane, BNYS", role: "Detox & Hydrotherapy Lead", exp: "14+ Yrs Exp" },
  { id: "d3", name: "Kavita Pillai, MSc", role: "Clinical Dietitian", exp: "12+ Yrs Exp" },
];

const SERVICES = [
  "45-Min Initial Health & Diet Assessment",
  "7-Day Guided Residential Detox",
  "Therapeutic Yoga & Pranayama Session",
  "PCOS & Women's Hormonal Consultation",
  "Joint Pain & Spine Hydrotherapy",
];

const TIME_SLOTS = [
  "09:30 AM", "11:00 AM", "02:00 PM", "04:30 PM", "06:00 PM"
];

export function ConsultationBookingModal() {
  const { isBookingOpen, setIsBookingOpen, addBooking } = useECommerce();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [doctor, setDoctor] = useState(DOCTORS[0].name);
  const [service, setService] = useState(SERVICES[0]);
  const [visitType, setVisitType] = useState<"In-Clinic Pune" | "Online Video Consultation">("Online Video Consultation");
  const [date, setDate] = useState("2026-09-12");
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isBookingOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !phone) return;

    addBooking({
      id: "bk_" + Date.now(),
      doctor,
      service,
      date,
      timeSlot,
      type: visitType,
      patientName,
      phone,
    });

    setSuccess(true);
  };

  const handleClose = () => {
    setIsBookingOpen(false);
    setStep(1);
    setSuccess(false);
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="booking-modal card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn btn-icon" onClick={handleClose}>
          ✕
        </button>

        {!success ? (
          <>
            <header className="booking-header">
              <span className="eyebrow">Virtual &amp; Clinic Care</span>
              <h2>Book Naturopathic Consultation ({step}/3)</h2>
            </header>

            {step === 1 && (
              <div className="booking-body">
                <h3>1. Select Doctor &amp; Specialty Care</h3>
                <div className="booking-options-list">
                  {DOCTORS.map((d) => (
                    <button
                      key={d.id}
                      className={`booking-opt-card ${doctor === d.name ? "selected" : ""}`}
                      onClick={() => setDoctor(d.name)}
                    >
                      <div className="doctor-avatar-sm">🌿</div>
                      <div>
                        <strong>{d.name}</strong>
                        <span className="muted" style={{ fontSize: ".82rem", display: "block" }}>
                          {d.role} · {d.exp}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="field" style={{ marginTop: 18 }}>
                  <label>Consultation Type</label>
                  <div className="row2">
                    <button
                      type="button"
                      className={`btn ${visitType === "Online Video Consultation" ? "btn-primary" : "btn-outline"}`}
                      onClick={() => setVisitType("Online Video Consultation")}
                    >
                      📹 Online Video Session
                    </button>
                    <button
                      type="button"
                      className={`btn ${visitType === "In-Clinic Pune" ? "btn-primary" : "btn-outline"}`}
                      onClick={() => setVisitType("In-Clinic Pune")}
                    >
                      🏥 In-Clinic Pune Visit
                    </button>
                  </div>
                </div>

                <button className="btn btn-gold btn-block" style={{ marginTop: 20 }} onClick={() => setStep(2)}>
                  Continue to Select Date &amp; Time →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="booking-body">
                <h3>2. Choose Date &amp; Available Slot</h3>

                <div className="field">
                  <label>Select Service</label>
                  <select value={service} onChange={(e) => setService(e.target.value)}>
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="row2">
                  <div className="field">
                    <label>Preferred Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min="2026-09-09" />
                  </div>

                  <div className="field">
                    <label>Time Slot</label>
                    <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                  <button className="btn btn-outline" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button className="btn btn-gold" style={{ flex: 1 }} onClick={() => setStep(3)}>
                    Enter Contact Details →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleConfirm} className="booking-body">
                <h3>3. Patient Contact &amp; Confirmation</h3>

                <div className="booking-summary-pill">
                  <strong>{doctor}</strong>
                  <span style={{ display: "block", fontSize: ".85rem" }}>
                    {service} · {date} at {timeSlot} ({visitType})
                  </span>
                </div>

                <div className="field">
                  <label>Full Patient Name *</label>
                  <input
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Ananya Deshpande"
                  />
                </div>

                <div className="field">
                  <label>Mobile Number (For WhatsApp Link) *</label>
                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>
                    ← Back
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Confirm Appointment 📅
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          <div className="center" style={{ padding: "30px 10px" }}>
            <span style={{ fontSize: "3rem" }}>🎉</span>
            <h2 style={{ margin: "14px 0 6px" }}>Appointment Confirmed!</h2>
            <p className="lead" style={{ fontSize: "0.95rem" }}>
              Your session with <strong>{doctor}</strong> has been booked for <strong>{date}</strong> at <strong>{timeSlot}</strong>.
            </p>
            <p className="muted" style={{ fontSize: ".88rem" }}>
              Our clinic receptionist will send your video link &amp; pre-consultation diet sheet to <strong>{phone}</strong> over WhatsApp.
            </p>
            <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={handleClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
