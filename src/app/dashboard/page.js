"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPatch, apiPost } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const slotList = [
  "09:00-09:15",
  "09:15-09:30",
  "09:30-09:45",
  "09:45-10:00",
  "10:00-10:15",
  "10:15-10:30",
  "10:30-10:45",
  "10:45-11:00",
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const info = await apiGet("/api/auth/me");
        setUser(info.user);
      } catch (err) {
        setUser(null);
      } finally {
        setBusy(false);
      }
    };

    loadUser();
  }, []);

  const onLogout = async () => {
    await apiPost("/api/auth/logout");
    router.push("/");
  };

  if (busy) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white/70">
        Loading your clinic...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-white">
        <p>You are not signed in.</p>
        <Button onClick={() => router.push("/")}>Go to login</Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-6 py-10 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-12 top-24 h-32 w-32 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute right-12 top-40 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="glass-panel panel-edge flex flex-wrap items-center justify-between gap-4 rounded-3xl px-6 py-5 fade-up">
          <div>
            <p className="section-title">Clinic workspace</p>
            <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-space)" }}>
              {user.clinicName || "Clinique CMS"}
            </h1>
            <p className="text-sm text-white/60">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="chip text-white">{user.role}</Badge>
            <Button variant="secondary" onClick={onLogout}>
              Log out
            </Button>
          </div>
        </header>

        {user.role === "admin" && <AdminPanel />}
        {user.role === "patient" && <PatientPanel />}
        {user.role === "receptionist" && <ReceptionistPanel />}
        {user.role === "doctor" && <DoctorPanel />}
      </div>
    </div>
  );
}

function AdminPanel() {
  const [clinic, setClinic] = useState(null);
  const [users, setUsers] = useState([]);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "receptionist",
    phone: "",
  });

  const loadAdmin = async () => {
    setBusy(true);
    try {
      const clinicInfo = await apiGet("/api/admin/clinic");
      const list = await apiGet("/api/admin/users");
      setClinic(clinicInfo);
      setUsers(list || []);
    } catch (err) {
      toast.error(err.message || "Failed to load admin data");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    loadAdmin();
  }, []);

  const onCreateUser = async (event) => {
    event.preventDefault();
    try {
      await apiPost("/api/admin/users", form);
      toast.success("User created");
      setForm({ name: "", email: "", password: "", role: "receptionist", phone: "" });
      loadAdmin();
    } catch (err) {
      toast.error(err.message || "Failed to create user");
    }
  };

  return (
    <Tabs defaultValue="overview" className="glass-panel panel-edge grid-sheen rounded-3xl p-6 fade-up delay-1">
      <TabsList className="bg-white/5 p-1">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Clinic code" value={clinic?.clinicCode || "-"} />
          <StatCard label="Users" value={clinic?.userCount ?? "-"} />
          <StatCard label="Appointments" value={clinic?.appointmentCount ?? "-"} />
        </div>
        <Card className="glass-panel grid-sheen border-white/10">
          <CardHeader>
            <CardTitle>Queue status</CardTitle>
            <CardDescription className="text-white/60">
              Total queue entries for your clinic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{clinic?.queueCount ?? "-"}</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="users" className="mt-6 space-y-6">
        <Card className="glass-panel grid-sheen border-white/10">
          <CardHeader>
            <CardTitle>Create a user</CardTitle>
            <CardDescription className="text-white/60">
              Create doctor, receptionist, or patient accounts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={onCreateUser}>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(value) => setForm({ ...form, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="patient">Patient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Phone (optional)</Label>
                <Input
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                />
              </div>
              <Button disabled={busy} type="submit" className="md:col-span-2">
                {busy ? "Saving..." : "Create user"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass-panel grid-sheen border-white/10">
          <CardHeader>
            <CardTitle>Clinic users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-white/60">
                      No users yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell className="capitalize">{item.role}</TableCell>
                      <TableCell>{item.phone || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function PatientPanel() {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [detailId, setDetailId] = useState("");
  const [detail, setDetail] = useState(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ appointmentDate: "", timeSlot: "" });

  const loadPatient = async () => {
    setBusy(true);
    try {
      const list = await apiGet("/api/appointments/my");
      const meds = await apiGet("/api/prescriptions/my");
      const rep = await apiGet("/api/reports/my");
      setAppointments(list || []);
      setPrescriptions(meds || []);
      setReports(rep || []);
    } catch (err) {
      toast.error(err.message || "Failed to load patient data");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    loadPatient();
  }, []);

  const onBook = async (event) => {
    event.preventDefault();
    try {
      await apiPost("/api/appointments", form);
      toast.success("Appointment booked");
      setForm({ appointmentDate: "", timeSlot: "" });
      loadPatient();
    } catch (err) {
      toast.error(err.message || "Booking failed");
    }
  };

  const onLoadDetail = async () => {
    if (!detailId) {
      toast.error("Enter an appointment id");
      return;
    }
    try {
      const info = await apiGet(`/api/appointments/${detailId}`);
      setDetail(info);
    } catch (err) {
      toast.error(err.message || "Failed to load details");
    }
  };

  return (
    <Tabs defaultValue="book" className="glass-panel panel-edge grid-sheen rounded-3xl p-6 fade-up delay-1">
      <TabsList className="bg-white/5 p-1">
        <TabsTrigger value="book">Book</TabsTrigger>
        <TabsTrigger value="appointments">My appointments</TabsTrigger>
        <TabsTrigger value="records">Records</TabsTrigger>
      </TabsList>

      <TabsContent value="book" className="mt-6 space-y-6">
        <Card className="glass-panel grid-sheen border-white/10">
          <CardHeader>
            <CardTitle>Book a slot</CardTitle>
            <CardDescription className="text-white/60">
              Pick a date and time slot. Slots are unique per clinic.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={onBook}>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.appointmentDate}
                  onChange={(event) =>
                    setForm({ ...form, appointmentDate: event.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Time slot</Label>
                <Select
                  value={form.timeSlot}
                  onValueChange={(value) => setForm({ ...form, timeSlot: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {slotList.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button disabled={busy} type="submit" className="md:col-span-2">
                {busy ? "Booking..." : "Book appointment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appointments" className="mt-6 space-y-6">
        <Card className="glass-panel grid-sheen border-white/10">
          <CardHeader>
            <CardTitle>Upcoming appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Slot</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Token</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-white/60">
                      No appointments yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.appointmentDate}</TableCell>
                      <TableCell>{item.timeSlot}</TableCell>
                      <TableCell className="capitalize">{item.status}</TableCell>
                      <TableCell>{item.queueEntry?.tokenNumber ?? "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="glass-panel grid-sheen border-white/10">
          <CardHeader>
            <CardTitle>Appointment details</CardTitle>
            <CardDescription className="text-white/60">
              Enter an appointment id from your list.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Input
                value={detailId}
                onChange={(event) => setDetailId(event.target.value)}
                placeholder="Appointment id"
                className="max-w-xs"
              />
              <Button onClick={onLoadDetail}>Load details</Button>
            </div>
            {detail ? (
              <div className="space-y-2 rounded-xl border border-white/10 p-4">
                <p>
                  <span className="text-white/50">Date:</span> {detail.appointmentDate}
                </p>
                <p>
                  <span className="text-white/50">Slot:</span> {detail.timeSlot}
                </p>
                <p>
                  <span className="text-white/50">Status:</span> {detail.status}
                </p>
                <Separator className="bg-white/10" />
                <p className="text-sm text-white/60">Prescription</p>
                <pre className="whitespace-pre-wrap text-sm text-white/80">
                  {JSON.stringify(detail.prescription || {}, null, 2)}
                </pre>
                <p className="text-sm text-white/60">Report</p>
                <pre className="whitespace-pre-wrap text-sm text-white/80">
                  {JSON.stringify(detail.report || {}, null, 2)}
                </pre>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="records" className="mt-6 space-y-6">
        <Card className="glass-panel grid-sheen border-white/10">
          <CardHeader>
            <CardTitle>Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm text-white/80">
              {JSON.stringify(prescriptions, null, 2)}
            </pre>
          </CardContent>
        </Card>
        <Card className="glass-panel grid-sheen border-white/10">
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm text-white/80">
              {JSON.stringify(reports, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function ReceptionistPanel() {
  const [date, setDate] = useState("");
  const [queue, setQueue] = useState([]);
  const [busy, setBusy] = useState(false);

  const loadQueue = async () => {
    if (!date) {
      toast.error("Choose a date");
      return;
    }
    setBusy(true);
    try {
      const list = await apiGet("/api/queue", { date });
      setQueue(list || []);
    } catch (err) {
      toast.error(err.message || "Failed to load queue");
    } finally {
      setBusy(false);
    }
  };

  const onUpdate = async (id, status) => {
    try {
      await apiPatch(`/api/queue/${id}`, { status });
      toast.success("Queue updated");
      loadQueue();
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  return (
    <Card className="glass-panel panel-edge grid-sheen border-white/10 fade-up delay-1">
      <CardHeader>
        <CardTitle>Daily queue</CardTitle>
        <CardDescription className="text-white/60">
          Load and update the queue for a specific date.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <Button onClick={loadQueue} disabled={busy}>
            {busy ? "Loading..." : "Load queue"}
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queue.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-white/60">
                  No queue items.
                </TableCell>
              </TableRow>
            ) : (
              queue.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.tokenNumber}</TableCell>
                  <TableCell>{item.appointment?.patient?.name || "-"}</TableCell>
                  <TableCell className="capitalize">{item.status}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onUpdate(item.id, "in-progress")}
                      >
                        In progress
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onUpdate(item.id, "done")}
                      >
                        Done
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onUpdate(item.id, "skipped")}
                      >
                        Skipped
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function DoctorPanel() {
  const [queue, setQueue] = useState([]);
  const [busy, setBusy] = useState(false);
  const [med, setMed] = useState({ name: "", dosage: "", duration: "" });
  const [medList, setMedList] = useState([]);
  const [pres, setPres] = useState({ appointmentId: "", notes: "" });
  const [report, setReport] = useState({ appointmentId: "", diagnosis: "", testRecommended: "", remarks: "" });

  const loadQueue = async () => {
    setBusy(true);
    try {
      const list = await apiGet("/api/doctor/queue");
      setQueue(list || []);
    } catch (err) {
      toast.error(err.message || "Failed to load queue");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const onAddMed = () => {
    if (!med.name || !med.dosage || !med.duration) {
      toast.error("Fill medicine name, dosage, and duration");
      return;
    }
    setMedList([...medList, med]);
    setMed({ name: "", dosage: "", duration: "" });
  };

  const onSubmitPrescription = async (event) => {
    event.preventDefault();
    const id = Number(pres.appointmentId);
    if (!id) {
      toast.error("Enter appointment id");
      return;
    }
    if (medList.length === 0) {
      toast.error("Add at least one medicine");
      return;
    }
    try {
      await apiPost(`/api/prescriptions/${id}`, {
        medicines: medList,
        notes: pres.notes,
      });
      toast.success("Prescription saved");
      setPres({ appointmentId: "", notes: "" });
      setMedList([]);
      loadQueue();
    } catch (err) {
      toast.error(err.message || "Failed to save prescription");
    }
  };

  const onSubmitReport = async (event) => {
    event.preventDefault();
    const id = Number(report.appointmentId);
    if (!id) {
      toast.error("Enter appointment id");
      return;
    }
    try {
      await apiPost(`/api/reports/${id}`, {
        diagnosis: report.diagnosis,
        testRecommended: report.testRecommended,
        remarks: report.remarks,
      });
      toast.success("Report saved");
      setReport({ appointmentId: "", diagnosis: "", testRecommended: "", remarks: "" });
      loadQueue();
    } catch (err) {
      toast.error(err.message || "Failed to save report");
    }
  };

  return (
    <Tabs defaultValue="queue" className="glass-panel panel-edge grid-sheen rounded-3xl p-6 fade-up delay-1">
      <TabsList className="bg-white/5 p-1">
        <TabsTrigger value="queue">Queue</TabsTrigger>
        <TabsTrigger value="prescription">Prescription</TabsTrigger>
        <TabsTrigger value="report">Report</TabsTrigger>
      </TabsList>

      <TabsContent value="queue" className="mt-6">
        <Card className="glass-panel grid-sheen border-white/10">
          <CardHeader>
            <CardTitle>Today&apos;s queue</CardTitle>
            <CardDescription className="text-white/60">
              Appointment id is used for prescription and report.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={loadQueue} disabled={busy} className="mb-4">
              {busy ? "Refreshing..." : "Refresh"}
            </Button>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Appointment id</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-white/60">
                      No queue items.
                    </TableCell>
                  </TableRow>
                ) : (
                  queue.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.tokenNumber}</TableCell>
                      <TableCell>{item.patientName}</TableCell>
                      <TableCell className="capitalize">{item.status}</TableCell>
                      <TableCell>{item.appointmentId}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="prescription" className="mt-6 space-y-6">
        <Card className="glass-panel grid-sheen border-white/10">
          <CardHeader>
            <CardTitle>Add prescription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmitPrescription}>
              <div className="space-y-2">
                <Label>Appointment id</Label>
                <Input
                  value={pres.appointmentId}
                  onChange={(event) => setPres({ ...pres, appointmentId: event.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  value={pres.notes}
                  onChange={(event) => setPres({ ...pres, notes: event.target.value })}
                />
              </div>
              <div className="md:col-span-2 rounded-xl border border-white/10 p-4">
                <p className="text-sm text-white/60">Medicines</p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <Input
                    placeholder="Name"
                    value={med.name}
                    onChange={(event) => setMed({ ...med, name: event.target.value })}
                  />
                  <Input
                    placeholder="Dosage"
                    value={med.dosage}
                    onChange={(event) => setMed({ ...med, dosage: event.target.value })}
                  />
                  <Input
                    placeholder="Duration"
                    value={med.duration}
                    onChange={(event) => setMed({ ...med, duration: event.target.value })}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" onClick={onAddMed}>
                    Add medicine
                  </Button>
                </div>
                {medList.length > 0 ? (
                  <ul className="mt-4 space-y-2 text-sm">
                    {medList.map((item, index) => (
                      <li key={`${item.name}-${index}`}>
                        {item.name} • {item.dosage} • {item.duration}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <Button type="submit" className="md:col-span-2">
                Save prescription
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="report" className="mt-6">
        <Card className="glass-panel grid-sheen border-white/10">
          <CardHeader>
            <CardTitle>Add report</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmitReport}>
              <div className="space-y-2">
                <Label>Appointment id</Label>
                <Input
                  value={report.appointmentId}
                  onChange={(event) => setReport({ ...report, appointmentId: event.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Diagnosis</Label>
                <Input
                  value={report.diagnosis}
                  onChange={(event) => setReport({ ...report, diagnosis: event.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Test recommended</Label>
                <Input
                  value={report.testRecommended}
                  onChange={(event) => setReport({ ...report, testRecommended: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Remarks</Label>
                <Textarea
                  value={report.remarks}
                  onChange={(event) => setReport({ ...report, remarks: event.target.value })}
                />
              </div>
              <Button type="submit" className="md:col-span-2">
                Save report
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function StatCard({ label, value }) {
  return (
    <Card className="glass-panel grid-sheen border-white/10">
      <CardHeader>
        <CardDescription className="section-title">{label}</CardDescription>
        <CardTitle className="text-3xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
