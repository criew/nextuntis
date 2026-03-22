import { http, HttpResponse } from 'msw'
import type { components } from '../../types/generated/api'

type StudentResponse = components['schemas']['StudentResponse']

const BASE_URL = 'http://localhost'

const studentsFixture: StudentResponse[] = [
  {
    id: 1,
    firstName: 'Max',
    lastName: 'Mustermann',
    dateOfBirth: '2010-05-15',
    gradeLevel: 7,
    email: 'max.mustermann@schule.de',
  },
  {
    id: 2,
    firstName: 'Anna',
    lastName: 'Schmidt',
    dateOfBirth: '2011-03-22',
    gradeLevel: 6,
    email: null,
  },
  {
    id: 3,
    firstName: 'Lena',
    lastName: 'Müller',
    dateOfBirth: '2009-11-08',
    gradeLevel: 8,
    email: 'lena.mueller@schule.de',
  },
]

let nextId = 4
const students = [...studentsFixture]

export const studentHandlers = [
  http.get(`${BASE_URL}/api/students`, () => {
    return HttpResponse.json(students)
  }),

  http.get(`${BASE_URL}/api/students/:id`, ({ params }) => {
    const id = Number(params.id)
    const student = students.find((s) => s.id === id)
    if (!student) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(student)
  }),

  http.post(`${BASE_URL}/api/students`, async ({ request }) => {
    const body = (await request.json()) as components['schemas']['StudentRequest']
    const newStudent: StudentResponse = {
      id: nextId++,
      firstName: body.firstName,
      lastName: body.lastName,
      dateOfBirth: body.dateOfBirth,
      gradeLevel: body.gradeLevel,
      email: body.email ?? null,
    }
    students.push(newStudent)
    return HttpResponse.json(newStudent, { status: 201 })
  }),

  http.put(`${BASE_URL}/api/students/:id`, async ({ params, request }) => {
    const id = Number(params.id)
    const index = students.findIndex((s) => s.id === id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    const body = (await request.json()) as components['schemas']['StudentRequest']
    const updated: StudentResponse = {
      id,
      firstName: body.firstName,
      lastName: body.lastName,
      dateOfBirth: body.dateOfBirth,
      gradeLevel: body.gradeLevel,
      email: body.email ?? null,
    }
    students[index] = updated
    return HttpResponse.json(updated)
  }),

  http.delete(`${BASE_URL}/api/students/:id`, ({ params }) => {
    const id = Number(params.id)
    const index = students.findIndex((s) => s.id === id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    students.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
