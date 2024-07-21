export interface Author{
    name:string,
    _id:string
}
export interface Book{
    _id:string,
    description:string,
    title:string,
    genre:string,
    author:Author,
    coverImage:string,
    file:string,
    createdAt:string
}