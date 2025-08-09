import * as React from "react";
import { 
  Card as MuiCard, 
  CardContent as MuiCardContent,
  Typography,
  Box
} from "@mui/material";

// Adapter components that map shadcn Card API to MUI Card
export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <MuiCard
    ref={ref}
    sx={{
      borderRadius: 2,
      boxShadow: 1,
      bgcolor: 'background.paper',
      transition: 'all 0.3s',
      '&:hover': {
        boxShadow: 3
      }
    }}
    {...props}
  >
    {children}
  </MuiCard>
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <Box
    ref={ref}
    sx={{
      p: 3,
      pb: 2
    }}
    {...props}
  >
    {children}
  </Box>
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <Typography
    ref={ref}
    variant="h6"
    component="h3"
    sx={{
      fontWeight: 600,
      fontSize: '1.125rem'
    }}
    {...props}
  >
    {children}
  </Typography>
));
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <MuiCardContent
    ref={ref}
    sx={{
      p: 3,
      pt: 0,
      '&:last-child': {
        pb: 3
      }
    }}
    {...props}
  >
    {children}
  </MuiCardContent>
));
CardContent.displayName = "CardContent";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <Typography
    ref={ref}
    variant="body2"
    color="text.secondary"
    sx={{ mt: 1 }}
    {...props}
  >
    {children}
  </Typography>
));
CardDescription.displayName = "CardDescription";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <Box
    ref={ref}
    sx={{
      display: 'flex',
      alignItems: 'center',
      p: 3,
      pt: 0
    }}
    {...props}
  >
    {children}
  </Box>
));
CardFooter.displayName = "CardFooter";