"use client";
import { useState, useCallback, useEffect } from "react";
import DrawerModal from "@/components/ui/modal/drawerModal/DrawerModal";
import styles from "./UserFinancialInfoModal.module.scss";
import TextField from "@/components/ui/forms/textField/TextField";
import Button from "@/components/ui/actions/button/Button";
import Text from "@/components/ui/text/Text";
import Dropdown from "@/components/ui/forms/dropdown/Dropdown";
import { getBanks } from "@/services/api/banks";
import { BankItemDto } from "@/dtos/banks.dto";
import { createUserBankCard } from "@/services/api/bank";
import Badge from "@/components/ui/badge/Badge"; 

export type UserCardInfo = {
	title: string;
	cardNumber: string;
};

type UserFinancialInfoModalProps = {
	isOpen: boolean;
	setIsOpenAction: (isOpen: boolean) => void;
	onSubmit?: (data: UserCardInfo) => void;
};

export default function UserFinancialInfoModal({
	isOpen,
	setIsOpenAction,
	onSubmit,
}: UserFinancialInfoModalProps) {
	const [title, setTitle] = useState<string>("");
	const [cardNumber, setCardNumber] = useState<string>("");
	const [bankOptions, setBankOptions] = useState<{ label: string; value: string }[]>([]);
	const [isLoadingBanks, setIsLoadingBanks] = useState<boolean>(false);
	const [banksError, setBanksError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const formatCardNumber = useCallback((value: string) => {
		const digitsOnly = value.replace(/\D/g, "");
		const groups = digitsOnly.match(/.{1,4}/g);
		return groups ? groups.join(" - ") : digitsOnly;
	}, []);

	useEffect(() => {
		if (!isOpen) return;
		setIsLoadingBanks(true);
		setBanksError(null);
		getBanks(0)
			.then((res) => {
				const options = (res.items || []).map((b: BankItemDto) => ({
					label: b.bank_name,
					value: String(b.bank_id),
				}));
				setBankOptions(options);
				// پیش‌فرض اولین بانک را انتخاب کن اگر چیزی انتخاب نشده بود
				if (!title && options.length > 0) {
					setTitle(options[0].value);
				}
			})
			.catch((e) => setBanksError(String(e?.message || e)))
			.finally(() => setIsLoadingBanks(false));
  }, [isOpen, title]);

	return (
		<DrawerModal isOpen={isOpen} setIsOpen={setIsOpenAction}>
			<div className={styles["user-address-modal"]}>
				<div className={styles["user-address-modal_content"]}>
					<Badge
						size="md"
						bgc="secondary2-100" 
						fullWidth={true}
					>
						<Text textStyle="12S4" textColor="secondary2-700">
							توجه داشته باشید که شماره شبا که وارد می‌کنید باید به نام خودتان باشد.
						</Text>
					</Badge>
					<Dropdown
						placeholder={isLoadingBanks ? "در حال بارگذاری..." : "نام بانک"}
						value={title}
						onChangeAction={setTitle}
						options={bankOptions}
					/>
					{banksError && (
						<Text textStyle="12S4" textColor="error-700">{banksError}</Text>
					)}
					<TextField
						placeholder="شماره شبا"
						label="شماره شبا"
						baseColor={{
							borderAndLabel: "gray-300",
							inputBgColor: "main-white",
							textInput: "gray-950",
							textError: "error-900",
						}}
						maxLength={39}
						size="sm"
						inputMode="numeric"
						leftContentText="IR"
						value={cardNumber}
						onChangeAction={(v) => setCardNumber(formatCardNumber(v))}
					/>
				</div>
				<div className={styles["user-address-modal_actions"]}>
					<Button
						bgColor="transparent"
						borderColor="secondary2-500"
						mode="side-rounded"
						paddingStyle="avg-8-24"
						onClick={() => setIsOpenAction(false)}
						fullScreen={true}
					>
						<Text
							fontFamily="moraba"
							textStyle="16S5"
							textColor="secondary2-500"
						>
							انصراف
						</Text>
					</Button>
					<Button
						bgColor="primary-600"
						hoverColor="primary-700"
						mode="side-rounded"
						paddingStyle="avg-8-24"
						disabled={isSubmitting}
						onClick={async () => {
							const ibanDigits = (cardNumber || "").replace(/\D/g, "");
							const bankId = title ? Number(title) : NaN;
							try {
								setIsSubmitting(true);
								if (!bankId || Number.isNaN(bankId)) {
									throw new Error("بانک انتخاب نشده است");
								}
								if (!ibanDigits || ibanDigits.length !== 24) {
									throw new Error("شماره شبا نامعتبر است (باید 24 رقم بدون IR باشد)");
								}
								await createUserBankCard({
									bank_id: bankId,
									iban: ibanDigits,
									account_number: "",
									account_owner: "",
									is_default: 0,
								});
								onSubmit?.({ title, cardNumber: ibanDigits });
								setIsOpenAction(false);
      } catch {
								// handled by global toast in client
							} finally {
								setIsSubmitting(false);
							}
						}}
						fullScreen={true}
					>
						<Text fontFamily="moraba" textStyle="16S5" textColor="main-white">
							{isSubmitting ? "در حال ثبت..." : "ثبت کارت"}
						</Text>
					</Button>
				</div>
			</div>
		</DrawerModal>
	);
}
