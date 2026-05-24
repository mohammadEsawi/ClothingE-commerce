import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { User, Package, MapPin, Heart, Plus, Trash2, Star } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { AddressForm } from '@/components/customer/AddressForm'
import { OrderStatusBadge } from '@/components/customer/OrderStatusBadge'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useOrders
} from '@/hooks/useOrders'
import { formatDate, formatPrice } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import api from '@/lib/axios'
import type { Address } from '@/types'

export default function AccountPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { user, updateUser } = useAuthStore()
  const { language, toggleLanguage } = useUIStore()
  const { data: addresses } = useAddresses()
  const createAddress = useCreateAddress()
  const updateAddress = useUpdateAddress()
  const deleteAddress = useDeleteAddress()
  const { data: orders } = useOrders()

  const [editingProfile, setEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({ name: user?.name ?? '', phone: user?.phone ?? '' })
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSaveProfile = async () => {
    setIsUpdating(true)
    try {
      await api.put('/profile', profileData)
      updateUser(profileData)
      setEditingProfile(false)
      toast({ title: t('common.success') })
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddAddress = async (data: Omit<Address, 'id'>) => {
    try {
      await createAddress.mutateAsync(data)
      setShowAddressForm(false)
      toast({ title: t('common.success') })
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    }
  }

  const handleDeleteAddress = async (id: number) => {
    try {
      await deleteAddress.mutateAsync(id)
      toast({ title: 'Address deleted' })
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      await updateAddress.mutateAsync({ id, is_default: true })
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('account.title')}</h1>

      <Tabs defaultValue="profile">
        <TabsList className="w-full grid grid-cols-4 mb-6">
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{t('account.profile')}</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-1.5">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">{t('account.orders')}</span>
          </TabsTrigger>
          <TabsTrigger value="addresses" className="gap-1.5">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">{t('account.addresses')}</span>
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="gap-1.5">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">{t('account.wishlist')}</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="rounded-xl border bg-white p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary-100 text-primary-700 text-xl">
                  {user?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <Separator />

            {!editingProfile ? (
              <div className="space-y-3">
                <div>
                  <Label className="text-gray-500 text-xs">{t('auth.name')}</Label>
                  <p className="font-medium mt-0.5">{user?.name}</p>
                </div>
                <div>
                  <Label className="text-gray-500 text-xs">{t('auth.email')}</Label>
                  <p className="font-medium mt-0.5">{user?.email}</p>
                </div>
                {user?.phone && (
                  <div>
                    <Label className="text-gray-500 text-xs">{t('auth.phone')}</Label>
                    <p className="font-medium mt-0.5">{user.phone}</p>
                  </div>
                )}
                <Button onClick={() => setEditingProfile(true)} variant="outline">
                  {t('account.edit_profile')}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="mb-1 block">{t('auth.name')}</Label>
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="mb-1 block">{t('auth.phone')}</Label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSaveProfile} disabled={isUpdating}>
                    {isUpdating ? t('common.loading') : t('account.save_changes')}
                  </Button>
                  <Button variant="outline" onClick={() => setEditingProfile(false)}>
                    {t('common.cancel')}
                  </Button>
                </div>
              </div>
            )}

            <Separator />

            {/* Language Preference */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t('account.language_preference')}</p>
                <p className="text-sm text-gray-500">{language === 'en' ? 'English' : 'العربية'}</p>
              </div>
              <Switch checked={language === 'ar'} onCheckedChange={toggleLanguage} />
            </div>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <div className="space-y-3">
            {!orders || orders.length === 0 ? (
              <div className="rounded-xl border bg-white p-12 text-center">
                <Package className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">{t('orders.no_orders')}</p>
              </div>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div key={order.id} className="rounded-xl border bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-sm font-semibold">#{order.order_number}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at, lang)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <OrderStatusBadge status={order.status} />
                      <span className="font-bold text-sm">{formatPrice(order.total, lang)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses">
          <div className="space-y-3">
            {addresses?.map((addr) => (
              <div key={addr.id} className="rounded-xl border bg-white p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{addr.full_name}</p>
                      {addr.is_default && (
                        <span className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">
                          {t('account.default_address')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{addr.phone}</p>
                    <p className="text-sm text-gray-600">{addr.address_line1}</p>
                    <p className="text-sm text-gray-600">{addr.city}, {addr.state_province}</p>
                  </div>
                  <div className="flex gap-2">
                    {!addr.is_default && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-xs"
                      >
                        <Star className="h-3.5 w-3.5 me-1" />
                        {t('account.set_default')}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {!showAddressForm ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAddressForm(true)}
              >
                <Plus className="me-2 h-4 w-4" />
                {t('account.add_address')}
              </Button>
            ) : (
              <div className="rounded-xl border bg-white p-5">
                <h3 className="font-semibold mb-4">{t('account.add_address')}</h3>
                <AddressForm
                  onSubmit={handleAddAddress}
                  onCancel={() => setShowAddressForm(false)}
                  isLoading={createAddress.isPending}
                />
              </div>
            )}
          </div>
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist">
          <div className="rounded-xl border bg-white p-12 text-center">
            <Heart className="h-8 w-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">{t('wishlist.empty')}</p>
            <p className="text-sm text-gray-400 mt-1">{t('wishlist.empty_desc')}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
