import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    createStudentSchema,
    updateStudentSchema,
    type CreateStudentSchema,
} from '@/repositories/students/schema';
import { StudentStatus } from '@/repositories/students/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { StatesRepository } from '@/repositories/states/repo';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { DatePickerInput } from '@/components/shared/date-picker';

interface StudentFormProps {
    initialData?: Partial<CreateStudentSchema>;
    onSubmit: (data: any) => void;
    isLoading?: boolean;
    isEdit?: boolean;
}

export function StudentForm({
    initialData,
    onSubmit,
    isLoading,
    isEdit,
}: StudentFormProps) {
    const { data: states = [], isLoading: isLoadingStates } = useQuery({
        queryKey: ['states'],
        queryFn: () => StatesRepository.getAll(),
    });

    const schema = isEdit ? updateStudentSchema : createStudentSchema;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: initialData || {
            first_name: '',
            last_name: '',
            email: '',
            username: '',
            password: '',
            phone: '',
            state_id: undefined,
            enrollment_date: '',
            avatar: '',
            bio: '',
            ...(isEdit ? { status: undefined } : {}),
        },
    });

    const selectedStateId = watch('state_id');

    const handleFormSubmit = (data: any) => {
        const cleaned = { ...data };
        // Filter out empty password if in edit mode
        if (isEdit && !cleaned.password) {
            delete cleaned.password;
        }
        // Filter out empty optional string fields
        if (!cleaned.avatar) delete cleaned.avatar;
        if (!cleaned.bio) delete cleaned.bio;
        if (!cleaned.enrollment_date) delete cleaned.enrollment_date;
        onSubmit(cleaned);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                        id="first_name"
                        placeholder="John"
                        {...register('first_name')}
                        className={errors.first_name ? 'border-red-500' : ''}
                    />
                    {errors.first_name && (
                        <p className="text-red-500 text-xs">
                            {errors.first_name.message as string}
                        </p>
                    )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                        id="last_name"
                        placeholder="Doe"
                        {...register('last_name')}
                        className={errors.last_name ? 'border-red-500' : ''}
                    />
                    {errors.last_name && (
                        <p className="text-red-500 text-xs">
                            {errors.last_name.message as string}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        {...register('email')}
                        className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs">
                            {errors.email.message as string}
                        </p>
                    )}
                </div>

                {/* Username */}
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        placeholder="johndoe"
                        {...register('username')}
                        className={errors.username ? 'border-red-500' : ''}
                    />
                    {errors.username && (
                        <p className="text-red-500 text-xs">
                            {errors.username.message as string}
                        </p>
                    )}
                </div>

                {/* Password - Only for Create or if provided in Edit */}
                <div className="space-y-2">
                    <Label htmlFor="password">
                        {isEdit ? 'New Password (Optional)' : 'Password'}
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...register('password')}
                        className={errors.password ? 'border-red-500' : ''}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-xs">
                            {errors.password.message as string}
                        </p>
                    )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                        id="phone"
                        placeholder="+1 (555) 000-0000"
                        {...register('phone')}
                    />
                </div>

                {/* State */}
                <div className="space-y-2">
                    <Label htmlFor="state_id">State</Label>
                    <Select
                        onValueChange={(value) =>
                            setValue('state_id', parseInt(value))
                        }
                        value={selectedStateId?.toString()}
                    >
                        <SelectTrigger
                            className={errors.state_id ? 'border-red-500' : ''}
                        >
                            <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                        <SelectContent>
                            {isLoadingStates ? (
                                <div className="flex items-center justify-center p-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                </div>
                            ) : (
                                states.map((state) => (
                                    <SelectItem
                                        key={state.id}
                                        value={state.id.toString()}
                                    >
                                        {state.name}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                    {errors.state_id && (
                        <p className="text-red-500 text-xs">
                            {errors.state_id.message as string}
                        </p>
                    )}
                </div>

                {/* Enrollment Date */}
                <div className="space-y-2">
                    <Label htmlFor="enrollment_date">Enrollment Date</Label>
                    <DatePickerInput
                        value={watch('enrollment_date') || ''}
                        onChange={(date) => setValue('enrollment_date', date)}
                        title="Enrollment Date"
                    />
                </div>

                {/* Avatar URL */}
                <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <Input
                        id="avatar"
                        placeholder="https://example.com/avatar.jpg"
                        {...register('avatar')}
                        className={errors.avatar ? 'border-red-500' : ''}
                    />
                    {errors.avatar && (
                        <p className="text-red-500 text-xs">
                            {errors.avatar.message as string}
                        </p>
                    )}
                </div>

                {/* Status - Only for Edit */}
                {isEdit && (
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            onValueChange={(value) => {
                                const formData = getValues();
                                (formData as any).status = value;
                            }}
                            value={(watch() as any).status as string | undefined}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={StudentStatus.ACTIVE}>Active</SelectItem>
                                <SelectItem value={StudentStatus.INACTIVE}>Inactive</SelectItem>
                                <SelectItem value={StudentStatus.SUSPENDED}>Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {/* Bio - Full Width */}
            <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                    id="bio"
                    placeholder="Enter student bio..."
                    {...register('bio')}
                    className={errors.bio ? 'border-red-500' : ''}
                    rows={3}
                />
                {errors.bio && (
                    <p className="text-red-500 text-xs">
                        {errors.bio.message as string}
                    </p>
                )}
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => window.history.back()}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    )}
                    {isEdit ? 'Update Student' : 'Create Student'}
                </Button>
            </div>
        </form>
    );
}
