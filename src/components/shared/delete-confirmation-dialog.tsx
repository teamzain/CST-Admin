import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { AlertTriangle } from "lucide-react"

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  itemType: string
  itemName: string
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemType,
  itemName,
}: DeleteConfirmationDialogProps) {
  const [inputValue, setInputValue] = useState("")

  const isMatch = inputValue === itemName

  const handleConfirm = () => {
    if (isMatch) {
      onConfirm()
      setInputValue("")
      onClose()
    }
  }

  const handleClose = () => {
    setInputValue("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-300">
            This action cannot be undone. This will permanently delete the 
            <span className="font-semibold"> {itemName}</span> {itemType} and all associated data.
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmation-input">
              Type <span className="font-semibold">{itemName}</span> to confirm.
            </Label>
            <Input
              id="confirmation-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={itemName}
              className="border-red-200 focus-visible:ring-red-500"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={!isMatch}
            className="bg-destructive hover:bg-destructive/90"
          >
            Delete {itemType}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
