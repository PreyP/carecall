import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Patient } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast"; // Assuming a toast component exists

interface ScheduleCallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (callData: any) => void;
}

export function ScheduleCallDialog({
  isOpen,
  onClose,
  onSchedule,
}: ScheduleCallDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [priority, setPriority] = useState<string>("normal");
  const [notes, setNotes] = useState<string>("");

  const { data: patients, isLoading: patientsLoading } = useQuery<Patient[]>({
    queryKey: ['/api/patients'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedPatient) {
      return;
    }

    const selectedPatientId = parseInt(selectedPatient);
    const patient = patients?.find((p) => p.id === selectedPatientId);

    if (!patient) {
      return;
    }

    const callData = {
      patientId: selectedPatientId,
      patientName: patient.name,
      patientInitials: patient.initials,
      scheduledDate: format(selectedDate, "MMM d, yyyy"),
      scheduledTime: selectedTime,
      status: "scheduled",
      priority,
      notes,
    };

    onSchedule(callData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Schedule New Call</DialogTitle>
          <DialogDescription>
            Schedule an automated AI call with a patient. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Patient Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patient" className="text-right">
                Patient
              </Label>
              <div className="col-span-3">
                <Select
                  value={selectedPatient}
                  onValueChange={setSelectedPatient}
                  disabled={patientsLoading}
                >
                  <SelectTrigger id="patient">
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients?.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id.toString()}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Date</Label>
              <div className="col-span-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <div className="col-span-3">
                <Input
                  id="time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>

            {/* Priority Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <div className="col-span-3">
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any notes for this call (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedDate || !selectedPatient}
              className="bg-primary hover:bg-primary-dark text-white"
              onClick={(e) => {
                e.preventDefault();
                // In a real app, this would call an API to schedule the call
                toast({
                  title: "Call Scheduled",
                  description: "The call has been scheduled successfully.",
                });
                onClose();
              }}
            >
              Schedule Call
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}