import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/http/api";
import useTokenStore from "@/store";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useRef } from "react";
import { Link , useNavigate} from "react-router-dom";



const LoginPage = () => {
  const navigate = useNavigate();
  const setToken = useTokenStore((state) => state.setToken);
  const setUserId = useTokenStore((state)=>state.setUserId)

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      // console.log(response);
      
      setToken(response.data.accessToken)
      setUserId(response.data.userId)
      navigate('/dashboard/home')
    },
  })

  const handleLogin = ()=>{
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    // console.log("data ",{email,password});

    if(!email || !password){
      return alert('Email and Password are required')
    }
    mutation.mutate({email,password})
  }

  
  return (
    <section className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account. <br />
            {mutation.isError && (
              <span className="text-red-500 text-sm">{mutation.error.message}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input ref={emailRef} id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input ref={passwordRef} id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter>
            <div className="w-full">
            
            <Button onClick={handleLogin} className="w-full" disabled={mutation.isPending}>
            {mutation.isPending && <LoaderCircle className="animate-spin"/>}
              <span className="ml-2">Sign in</span>
            </Button>
            <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to={'/auth/register'} className="underline">
            Sign Up
            </Link>
        </div>
            </div>
        </CardFooter>
      </Card>
    </section>
  )
}

export default LoginPage;