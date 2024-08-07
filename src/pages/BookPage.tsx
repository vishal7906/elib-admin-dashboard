import { Badge } from '@/components/ui/badge';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { getBooks, deleteBook } from '@/http/api';
import { Book } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CirclePlus, LoaderCircle, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';

const BooksPage = () => {
    const queryClient = useQueryClient();

    // Fetch books
    const { data, isLoading, isError } = useQuery({
        queryKey: ['books'],
        queryFn: getBooks,
        staleTime: 10000, // in Milli-seconds
    });

    // Mutation for deleting a book
    const deleteMutation = useMutation({
        mutationFn: (bookId: string) => deleteBook(bookId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            console.log('Book deleted successfully');
        },
    });

    // Delete handler
    const handleDelete = (bookId: string) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            deleteMutation.mutate(bookId);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Books</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Link to="/dashboard/books/create">
                    <Button>
                        <CirclePlus size={20} />
                        <span className="ml-2">Add book</span>
                    </Button>
                </Link>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Books</CardTitle>
                    <CardDescription>
                        Manage your books and view their sales performance.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className='flex justify-center items-center h-full'>
                        <div><LoaderCircle className="animate-spin"/></div>
                    </div>
                  ) : isError ? (
                    <div className='text-red-500'>Error while displaying Books</div>
                  ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">
                                    <span className="sr-only">Image</span>
                                </TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Genre</TableHead>
                                <TableHead className="hidden md:table-cell">Author name</TableHead>
                                <TableHead className="hidden md:table-cell">Created at</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.data.map((book: Book) => {
                                return (
                                    <TableRow key={book._id}>
                                        <TableCell className="hidden sm:table-cell">
                                            <img
                                                alt={book.title}
                                                className="aspect-square rounded-md object-cover"
                                                height="64"
                                                src={book.coverImage}
                                                width="64"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{book.title}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{book.genre}</Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {book.author.name}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {book.createdAt}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        aria-haspopup="true"
                                                        size="icon"
                                                        variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <Link to={`/dashboard/books/edit/${book._id}`}>
                                                        <DropdownMenuItem className='cursor-pointer'>
                                                            <Pencil className='mr-2'/>
                                                            Edit
                                                            </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuItem onClick={() => handleDelete(book._id)}
                                                        className="cursor-pointer text-red-500">
                                                        <Trash className="mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table> 
                  )}
                </CardContent>
            </Card>
        </div>
    );
};

export default BooksPage;
