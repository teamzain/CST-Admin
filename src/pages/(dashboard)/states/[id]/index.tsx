'use client';

import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect } from 'react';
import { useStatesStore, type State } from '@/stores/states-store';
import { Badge } from '@/components/ui/badge';
import { DeleteConfirmationDialog } from '@/components/shared/delete-confirmation-dialog';

export default function StateDetailsPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getStateById, updateState, deleteState } = useStatesStore();
    
    // Convert string ID to number safely
    const stateId = id ? parseInt(id) : 0;
    const existingState = getStateById(stateId);

    const [formData, setFormData] = useState<Partial<State>>({});
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        if (existingState) {
            setFormData(existingState);
        }
    }, [existingState]);

    if (!existingState) {
        return (
            <div className="flex-1 bg-background p-8 flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold mb-4">State not found</h2>
                <Button onClick={() => navigate('/states')}>Back to States</Button>
            </div>
        );
    }

    const handleInputChange = (field: keyof State, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = () => {
        updateState(stateId, {
            ...formData,
            updated_at: new Date(),
        });
        navigate('/states');
    };

    const handleDeleteClick = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        deleteState(stateId);
        navigate('/states');
    };

    return (
        <div className="flex-1 bg-background w-full min-h-screen pt-6 pb-12">
            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete State"
                description="Are you sure you want to delete this state? This action cannot be undone and may affect associated courses and instructors."
                itemType="State"
                itemName={existingState.name}
            />
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/states')}
                            className="gap-2 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to States
                        </Button>
                        <div className="flex items-center gap-3 mt-4">
                            <h1 className="text-3xl font-bold text-foreground">
                                {formData.name}
                            </h1>
                            <Badge variant="outline" className="text-lg px-3 py-1">
                                {formData.code}
                            </Badge>
                            {formData.is_active ? (
                                <Badge className="bg-green-600">Active</Badge>
                            ) : (
                                <Badge variant="secondary">Inactive</Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="destructive" onClick={handleDeleteClick} className="gap-2">
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </Button>
                        <Button onClick={handleSave} className="gap-2">
                            <Save className="w-4 h-4" />
                            Save Changes
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Info */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>State identity and status</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>State Name</Label>
                                        <Input
                                            value={formData.name || ''}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className="bg-input border-border mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label>State Code</Label>
                                        <Input
                                            value={formData.code || ''}
                                            onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                                            className="bg-input border-border mt-2"
                                            maxLength={2}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <Checkbox
                                        id="is-active"
                                        checked={formData.is_active}
                                        onCheckedChange={(checked) => handleInputChange('is_active', checked as boolean)}
                                    />
                                    <Label htmlFor="is-active">Active (Visible in system)</Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Training Hours */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle>Training Requirements</CardTitle>
                                <CardDescription>Required hours for certification</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Unarmed Hours</Label>
                                        <Input
                                            type="number"
                                            value={formData.unarmed_hours || 0}
                                            onChange={(e) => handleInputChange('unarmed_hours', parseInt(e.target.value))}
                                            className="bg-input border-border mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label>Armed Hours</Label>
                                        <Input
                                            type="number"
                                            value={formData.armed_hours || 0}
                                            onChange={(e) => handleInputChange('armed_hours', parseInt(e.target.value))}
                                            className="bg-input border-border mt-2"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Passing Scores */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle>Exam & Scoring</CardTitle>
                                <CardDescription>Minimum scores required to pass</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Unarmed Passing Score (%)</Label>
                                        <Input
                                            type="number"
                                            value={formData.unarmed_passing_score || 0}
                                            onChange={(e) => handleInputChange('unarmed_passing_score', parseInt(e.target.value))}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label>Armed Passing Score (%)</Label>
                                        <Input
                                            type="number"
                                            value={formData.armed_passing_score || 0}
                                            onChange={(e) => handleInputChange('armed_passing_score', parseInt(e.target.value))}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Settings */}
                    <div className="space-y-8">
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle>Additional Rules</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="req-range"
                                        checked={formData.requires_range_training}
                                        onCheckedChange={(checked) => handleInputChange('requires_range_training', checked as boolean)}
                                    />
                                    <Label htmlFor="req-range">Requires Range Training</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="req-range-pass"
                                        checked={formData.requires_range_pass}
                                        onCheckedChange={(checked) => handleInputChange('requires_range_pass', checked as boolean)}
                                    />
                                    <Label htmlFor="req-range-pass">Requires Range Pass</Label>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle>Certification</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Certificate Validity (Years)</Label>
                                    <Input
                                        type="number"
                                        value={formData.certificate_validity_years || ''}
                                        onChange={(e) => handleInputChange('certificate_validity_years', parseInt(e.target.value))}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label>Template ID</Label>
                                    <Input
                                        value={formData.certificate_template || ''}
                                        onChange={(e) => handleInputChange('certificate_template', e.target.value)}
                                        placeholder="template_id_v1"
                                        className="mt-2"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        
                        <div className="text-sm text-muted-foreground pt-4 border-t border-border">
                            <p>Created: {formData.created_at?.toLocaleDateString()}</p>
                            <p>Last Updated: {formData.updated_at?.toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
