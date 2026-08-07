import { FormField } from "@/components/forms/FormField";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  adminInputClassName,
  adminTextareaClassName,
} from "@/lib/constants";
import { ARTICLE_INTRO_MAX_LENGTH } from "@/lib/validation";

export function ArticleFormFields({
  form,
  errors,
  categoryNames,
  onChange,
  onCategoryChange,
}) {
  return (
    <>
      <FormField id="category" label="Category" error={errors.category}>
        <Select
          value={form.category || undefined}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger
            id="category"
            className="h-12 w-full rounded-lg border border-brown-300 bg-white px-4 text-brown-900 data-placeholder:text-brown-600"
            aria-label="Category"
          >
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categoryNames.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField id="author" label="Author name">
        <Input
          id="author"
          value={form.author}
          readOnly
          className={`${adminInputClassName} bg-brown-100 text-brown-800`}
        />
      </FormField>

      <FormField id="title" label="Title" error={errors.title}>
        <Input
          id="title"
          placeholder="Article title"
          value={form.title}
          onChange={onChange("title")}
          className={adminInputClassName}
        />
      </FormField>

      <FormField
        id="description"
        label={`Introduction (max ${ARTICLE_INTRO_MAX_LENGTH} letters)`}
        error={errors.description}
      >
        <textarea
          id="description"
          rows={3}
          maxLength={ARTICLE_INTRO_MAX_LENGTH}
          placeholder="Introduction"
          value={form.description}
          onChange={onChange("description")}
          className={adminTextareaClassName}
        />
      </FormField>

      <FormField id="content" label="Content" error={errors.content}>
        <textarea
          id="content"
          rows={14}
          placeholder="Content"
          value={form.content}
          onChange={onChange("content")}
          className={adminTextareaClassName}
        />
      </FormField>
    </>
  );
}
