import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Building, 
  Mail, 
  Calendar, 
  Target, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { AccountWithPreferences } from '@/lib/types/account';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  account: AccountWithPreferences;
}

export function PreferencesModal({ 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  account 
}: PreferencesModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Account & Preferences
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Account Information */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div>
                  <p className="font-medium text-gray-900">{account.businessName}</p>
                  <p className="text-sm text-gray-500">Business Name</p>
                </div>
              </div>
              
              {account.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{account.email}</p>
                    <p className="text-sm text-gray-500">Email Address</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(account.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">Account Created</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences Information */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-pink-50 to-rose-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Target className="w-5 h-5 text-pink-600" />
                <span>Matching Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Business Type</span>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {account.preferences.businessType}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Industry</span>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {account.preferences.industry}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Funding Amount</span>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {account.preferences.fundingAmount}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Location</span>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {account.preferences.location}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Experience</span>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {account.preferences.experience}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Timeline</span>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {account.preferences.timeline}
                  </Badge>
                </div>
              </div>

              {account.preferences.goals && account.preferences.goals.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Goals</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {account.preferences.goals.map((goal, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onEdit}
              className="flex-1 bg-gradient-to-r from-brand-gold to-brand-orange hover:from-brand-gold/90 hover:to-brand-orange/90 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Preferences
            </Button>
            
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Account
                </h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete your account? This action cannot be undone and will remove all your data.
                </p>
                <div className="flex space-x-3">
                  <Button
                    onClick={handleDelete}
                    variant="destructive"
                    className="flex-1"
                  >
                    Delete Account
                  </Button>
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
