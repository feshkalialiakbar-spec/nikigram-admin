import  { useState } from "react";
import { Icon, Filter, Sort, DocumentText } from "iconsax-react";
import styles from "./FilterAndSortLayout.module.scss";
import BadgeItem from "../../../global/filterAndSortBar/customComponents/badgeItem/BadgeItem";
import OpenModal from "../../../global/filterAndSortBar/customComponents/openModal/OpenModal";
import FilterBar from "../../../global/filterAndSortBar/customComponents/filterBar/FilterBar";
import SortBar from "../../../global/filterAndSortBar/customComponents/sortBar/SortBar";
import Text from "@/components/ui/text/Text";
import ItemCounter from "../../../global/filterAndSortBar/customComponents/itemCounter/ItemCounter";
import useWindowWidth from "@/hooks/useWindowWidth";
import Button from "@/components/ui/actions/button/Button";

type FilterItem = {
  type: "dropdown" | "checkbox";
  id: string;
  label: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  value: string | boolean;
  disabled?: boolean;
};

type BadgeItemType = {
  id: string;
  icon: Icon;
  showBg: boolean;
  modalTitle: string;
  modalContent: React.ReactNode;
  modalFooter: React.ReactNode;
};
type filterAndSortLayoutProps = {
  cards: React.ReactNode;
  filters: FilterItem[];
  sortOptions: Array<{ id: string; label: string }>;
  onFilterChange: (id: string, value: string | boolean) => void;
  onSortChange: (sortId: string) => void;
  onClearFilters: () => void;
  totalItems: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  disabled?: boolean;
};
export default function FilterAndSortLayout({
  cards,
  filters,
  sortOptions,
  onFilterChange,
  onSortChange,
  onClearFilters,
  totalItems,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "جستجو...",
  disabled = false,
}: filterAndSortLayoutProps) {
  const { width, hydrated } = useWindowWidth();
  const isDesktop = hydrated && width >= 1280;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<BadgeItemType | null>(
    null
  );
  const [currentSort, setCurrentSort] = useState(sortOptions[0]?.id || "");

  const handleFilterChange = (id: string, value: string | boolean) => {
    onFilterChange(id, value);
  };

  const handleClearFilters = () => {
    onClearFilters();
  };



  const handleFilterBadgeClick = () => {
    setSelectedBadge({
      id: "filter",
      icon: Filter,
      showBg: true,
      modalTitle: "فیلترها",
      modalContent: (
        <FilterBar
          key={`modal-filterbar-${searchQuery}`}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          disabled={disabled}
        />
      ),
      modalFooter: null,
    });
    setIsModalOpen(true);
  };

  const handleSortBadgeClick = () => {
    setSelectedBadge({
      id: "sort",
      icon: Sort,
      showBg: true,
      modalTitle: "مرتب‌سازی",
      modalContent: (
        <div className={styles["sort-modal-content"]}>
          {sortOptions.map((option) => (
            <Button
              key={option.id}
              onClick={() => {
                setCurrentSort(option.id);
                onSortChange(option.id);
                setIsModalOpen(false);
              }}
              buttonClassName={styles["sort-modal-button"]}
              paddingStyle="equal-4"
            >
              <Text
                textColor={
                  currentSort === option.id ? "primary-700" : "gray-500"
                }
                textTag="p"
                textStyle="14S7"
              >
                {option.label}
              </Text>
            </Button>
          ))}
        </div>
      ),
      modalFooter: null,
    });
    setIsModalOpen(true);
  };

  const handleItemCounterBadgeClick = () => {
    setSelectedBadge({
      id: "counter",
      icon: DocumentText,
      showBg: true,
      modalTitle: "تعداد موارد",
      modalContent: (
        <div className={styles["counter-modal-content"]}>
          <Text textColor="gray-950" textTag="p" textStyle="16S7">
            تعداد کل موارد: {totalItems}
          </Text>
        </div>
      ),
      modalFooter: null,
    });
    setIsModalOpen(true);
  };

  return (
    <div className={styles["filter-and-sort-layout"]}>
      {isDesktop && (
        <div className={styles["filter-and-sort-layout__filter"]}>
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            searchPlaceholder={searchPlaceholder}
            disabled={disabled}
          />
        </div>
      )}
      <div className={styles["filter-and-sort-layout__main"]}>
        <div className={styles["filter-and-sort-layout__main-sort-bar"]}>
          {!isDesktop && (
            <div className={styles["filter-and-sort-layout__badge-items"]}>
              <BadgeItem
                Icon={Filter}
                showBg={true}
                onClick={handleFilterBadgeClick}
                text="فیلترها"
              />
              <BadgeItem
                Icon={Sort}
                showBg={true}
                onClick={handleSortBadgeClick}
                text={
                  sortOptions.find((option) => option.id === currentSort)
                    ?.label || "مرتب‌سازی"
                }
              />
              <BadgeItem
                Icon={DocumentText}
                showBg={false}
                onClick={handleItemCounterBadgeClick}
                text={`${totalItems} مورد`}
              />
            </div>
          )}
          {isDesktop && (
            <SortBar
              options={sortOptions}
              onSortChange={(sortId) => {
                setCurrentSort(sortId);
                onSortChange(sortId);
              }}
            />
          )}
          {isDesktop && <ItemCounter qty={totalItems} />}
        </div>
        {cards}
      </div>
      <OpenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalTitle={selectedBadge?.modalTitle || ""}
        modalContent={selectedBadge?.modalContent}
        modalFooter={selectedBadge?.modalFooter}
      />
    </div>
  );
}
