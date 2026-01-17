import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: 'danger' | 'warning';
}

const DeleteConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    description = 'This action cannot be undone. This will permanently delete this item.',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    isLoading = false,
    variant = 'danger',
}: DeleteConfirmModalProps) => {
    const handleConfirm = async () => {
        await onConfirm();
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <AlertDialogContent className="sm:max-w-106.25">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0">
                    <AlertDialogCancel disabled={isLoading} className="mt-0">
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={
                            variant === 'danger'
                                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                : 'bg-amber-500 text-white hover:bg-amber-600'
                        }
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait...
                            </>
                        ) : (
                            confirmText
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteConfirmModal;
