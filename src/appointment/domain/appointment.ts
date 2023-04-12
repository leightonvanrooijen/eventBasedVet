export type Appointment = {
  id: string
  startDate: Date
  type: "procedure"
}

// TODO complete once Person domain is in place
export const makeAppointment = ({ id, startDate, type }: Appointment) => {
  if (!id) throw new Error("A Appointment must have an id")
  if (!startDate) throw new Error("A Appointment must have an start date")
  if (!type) throw new Error("A Appointment must have an type")

  return {
    id,
    startDate,
    type,
  }
}

export const buildAppointmentActions = () => {
  return {
    bookAppointment: ({ startDate, type }: Omit<Appointment, "id">) => {},
  }
}
