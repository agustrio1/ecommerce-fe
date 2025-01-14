import { Metadata } from "next"
import SettingTemplate from "./template"

export const metadata: Metadata = {
    title: 'Pengaturan Akun - Agus Store',
    description: 'Atur pengaturan akun Anda di Agus Store.',
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <SettingTemplate>{children}</SettingTemplate>
    )
}