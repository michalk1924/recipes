"use client"
// import Form from 'next/form';
// import './style.css';
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
const schema = z.object({
    id: z.string().regex(/^\d+$/, { message: "ID must contain only digits" }).length(9, { message: "Id must contain 9 character(s)" }),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    date: z.string().refine((date) => new Date(date).getTime() < new Date().setHours(0, 0, 0, 0),
        { message: 'Date of Birth must be in the past' }
    ),
})
type FormFields = z.infer<typeof schema>;
export default function Home() {
    const {
        register,

        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
        mode: "onBlur",
    });
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(data);
        reset();
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="">
                <input {...register("id")} type="text" placeholder="ID" />
                {errors.id && (
                    <div className='error'>{errors.id.message}</div>
                )}
                <div>
                    <input {...register("firstName")} type="text" placeholder="FirstName" />
                    {errors.firstName && (
                        <div className='error'>{errors.firstName.message}</div>
                    )}
                </div>
                <input {...register("lastName")} type="text" placeholder="LastName" />
                {errors.lastName && (
                    <div className='error'>{errors.lastName.message}</div>
                )}
                <input {...register("date")} type="date" placeholder="Date" />
                {errors.date && (
                    <div className='error'>{errors.date.message}</div>
                )}
            </div>
            <input {...register("email")} type="email" placeholder="Email" />
            {errors.email && (
                <div className='error'>{errors.email.message}</div>
            )}
            <button disabled={isSubmitting} type="submit">
                {isSubmitting ? "Loading..." : "Submit"}
            </button>
        </form>
    );
}