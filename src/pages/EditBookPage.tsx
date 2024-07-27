import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { updateBook, getBookById } from '@/http/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Book } from '@/types';
import useTokenStore from '@/store';

// Validation schema for the form
const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Title must be at least 2 characters.',
    }),
    genre: z.string().min(2, {
        message: 'Genre must be at least 2 characters.',
    }),
    description: z.string().min(2, {
        message: 'Description must be at least 2 characters.',
    }),
    coverImage: z.instanceof(FileList).optional(), // Handle optional file
    file: z.instanceof(FileList).optional(), // Handle optional file
});

const EditBookPage = () => {
    const { id: bookId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [existingCoverImage, setExistingCoverImage] = useState<string | null>(null);
    const [existingFile, setExistingFile] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    // Fetch the book data
    const { data: book, isLoading } = useQuery<Book>({
        queryKey: ['book', bookId],
        queryFn: () => getBookById(bookId!),
        enabled: !!bookId
    });

    const getCurrentUserId = () => {
        const userId = useTokenStore.getState().userId;
        return userId; // Example: return the ID of the logged-in user
    };
    

    // Check authorization
 useEffect(() => {
    if (book) {
        setExistingCoverImage(book.coverImage);
        setExistingFile(book.file);
        const currentUserId = getCurrentUserId();
        // console.log(`Current User ID: ${currentUserId}`);
        // console.log(`Book Author ID: ${book.author._id}`);
        setIsAuthorized(book.author._id === currentUserId);
    }
}, [book]);

    // Set up the form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            genre: '',
            description: '',
            coverImage: undefined,
            file: undefined,
        },
    });

    // Reset the form when the book data changes
    useEffect(() => {
        if (book) {
            form.reset({
                title: book.title,
                genre: book.genre,
                description: book.description,
                // Preserve existing coverImage and file URLs
            });
        }
    }, [book, form]);

    // Mutation for updating the book
    const mutation = useMutation({
        mutationFn: (data: FormData) => updateBook(bookId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            console.log('Book updated successfully');
            navigate('/dashboard/books');
        },
    });

    // Form submission handler
    function onSubmit(values: z.infer<typeof formSchema>) {
        const formdata = new FormData();
        formdata.append('title', values.title);
        formdata.append('genre', values.genre);
        formdata.append('description', values.description);

        // Append new files if they are provided
        if (values.coverImage && values.coverImage.length > 0) {
            formdata.append('coverImage', values.coverImage[0]);
        } else if (existingCoverImage) {
            formdata.append('coverImage', existingCoverImage);
        }

        if (values.file && values.file.length > 0) {
            formdata.append('file', values.file[0]);
        } else if (existingFile) {
            formdata.append('file', existingFile);
        }

        mutation.mutate(formdata);

        console.log(values);
    }

    if (!bookId) {
        return <div>Invalid Book ID</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isAuthorized === false) {
        return <div className="text-red-500">You are not authorized to edit this book.</div>;
    }

    return (
        <section>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-between">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard/books">Books</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Edit</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard/books">
                                <Button variant={'outline'}>
                                    <span className="ml-2">Cancel</span>
                                </Button>
                            </Link>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending && <LoaderCircle className="animate-spin" />}
                                <span className="ml-2">Submit</span>
                            </Button>
                        </div>
                    </div>
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Edit book</CardTitle>
                            <CardDescription>
                                Fill out the form below to edit the book.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input type="text" className="w-full" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="genre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Genre</FormLabel>
                                            <FormControl>
                                                <Input type="text" className="w-full" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea className="min-h-32" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="coverImage"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Cover Image</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    className="w-full"
                                                    {...form.register('coverImage')}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Book File</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    className="w-full"
                                                    {...form.register('file')}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </section>
    );
};

export default EditBookPage;
