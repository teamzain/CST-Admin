'use client';

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { useStatesStore, type State } from '@/stores/states-store';

export default function CreateStatePage() {
    const navigate = useNavigate();
    const { addState, states } = useStatesStore();
    
    const [formData, setFormData] = useState<Omit<State, 'id' | 'created_at' | 'updated_at'>>({
        name: '',
        code: '',
        unarmed_hours: 20,
        armed_hours: 40,
        unarmed_passing_score: 70,
        armed_passing_score: 80,
        requires_range_training: false,
        requires_range_pass: false,
        certificate_template: '',
        certificate_validity_years: 1,
        is_active: true,
    });

    const handleInputChange = (field: keyof typeof formData, value: string | number | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = () => {
        const newId = Math.max(...states.map(s => s.id), 0) + 1;
        
        const newState: State = {
            id: newId,
            ...formData,
            created_at: new Date(),
            updated_at: new Date(),
        };
        
        addState(newState);
        navigate('/states');
    };

    return (
        <div className="flex-1 bg-background w-full min-h-screen pt-6 pb-12">
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
                        <h1 className="text-3xl font-bold text-foreground mt-4">
                            Add New State
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Configure licensing requirements for a new state
                        </p>
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
                                        <Label>State Name *</Label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="e.g. Illinois"
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label>State Code *</Label>
                                        <Input
                                            value={formData.code}
                                            onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                                            placeholder="e.g. IL"
                                            className="mt-2"
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
                                        <Label>Unarmed Hours *</Label>
                                        <Input
                                            type="number"
                                            value={formData.unarmed_hours}
                                            onChange={(e) => handleInputChange('unarmed_hours', parseInt(e.target.value))}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label>Armed Hours *</Label>
                                        <Input
                                            type="number"
                                            value={formData.armed_hours}
                                            onChange={(e) => handleInputChange('armed_hours', parseInt(e.target.value))}
                                            className="mt-2"
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
                                        <Label>Unarmed Passing Score (%) *</Label>
                                        <Input
                                            type="number"
                                            value={formData.unarmed_passing_score}
                                            onChange={(e) => handleInputChange('unarmed_passing_score', parseInt(e.target.value))}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label>Armed Passing Score (%) *</Label>
                                        <Input
                                            type="number"
                                            value={formData.armed_passing_score}
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

                        <Button 
                            className="w-full bg-primary hover:bg-primary/90" 
                            size="lg"
                            onClick={handleSubmit}
                            disabled={!formData.name || !formData.code}
                        >
                            Create State
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
