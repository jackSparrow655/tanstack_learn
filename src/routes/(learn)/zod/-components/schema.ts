import z from 'zod'

const step1Schema = z.object({
    name:z.string({error:"This is a required field."}).min(3, "Name should have minimun 3 charecters."),
    email:z.email({error:"email is required."}),
    age:z.number({error:"This is a required field."}).min(13, "Age should be minimum 13."),
    country:z.enum(["India", "United State", "Ireland"]),
    phone:z.string().optional
})