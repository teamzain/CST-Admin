/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePickerInput } from "@/components/shared/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Instructor {
  id: number
  name: string
  email: string
  license: string
  expiry: string
  state: string
  status: "active" | "expired" | "pending"
}

interface InstructorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  instructor?: Instructor
  onSave: (instructor: Omit<Instructor, "id"> & { id?: number }) => void
}

const states = ["Illinois", "Texas", "California", "Florida", "New York", "Ohio"]

export function InstructorModal({ open, onOpenChange, instructor, onSave }: InstructorModalProps) {
  const [formData, setFormData] = useState<Omit<Instructor, "id">>({
    name: "",
    email: "",
    license: "",
    expiry: "",
    state: "",
    status: "active",
  })

  useEffect(() => {
    if (instructor) {
      const { id, ...rest } = instructor
      setFormData(rest)
    } else {
      setFormData({
        name: "",
        email: "",
        license: "",
        expiry: "",
        state: "",
        status: "active",
      })
    }
  }, [instructor, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(instructor ? { ...formData, id: instructor.id } : formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>{instructor ? "Edit Instructor" : "Add Instructor"}</DialogTitle>
          <DialogDescription>
            {instructor ? "Update instructor information below." : "Fill in the details to add a new instructor."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Jane Smith"
              className="bg-input border-border mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jane@example.com"
              className="bg-input border-border mt-1"
            />
          </div>

          <div>
            <Label htmlFor="license">License Number</Label>
            <Input
              id="license"
              value={formData.license}
              onChange={(e) => setFormData({ ...formData, license: e.target.value })}
              placeholder="LIC-123456"
              className="bg-input border-border mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                <SelectTrigger className="bg-input border-border mt-1">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <div className="mt-1">
                <DatePickerInput
                  value={formData.expiry}
                  onChange={(date) => setFormData({ ...formData, expiry: date })}
                  title="Expiry Date"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "expired" | "pending") => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger className="bg-input border-border mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-border">
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {instructor ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
