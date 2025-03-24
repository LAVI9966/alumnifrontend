import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

const ForgotPassword = ({ text }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const url = process.env.NEXT_PUBLIC_URL;
  const forgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch(`${url}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) throw new Error(data.message);
      toast.success(
        data?.message || "Password reset email sent. Check your inbox."
      );
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        {text ? (
          <div className="mt-4 underline font-semibold text-center text-[#000000]">
            {" "}
            {text}
          </div>
        ) : (
          <div className="mt-4 text-center text-[#000000]">
            <p className="text-sm">
              Forgot Password?{" "}
              <span className="font-semibold cursor-pointer underline">
                Click here
              </span>
            </p>
          </div>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Forgot Password</AlertDialogTitle>
          <AlertDialogDescription>
            Enter your email to receive a password reset link.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="custom-input  w-full"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={forgotPassword} disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ForgotPassword;
