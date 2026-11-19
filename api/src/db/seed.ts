import dataSource from './data-source';
import dummyData from './data';
import { Category } from '../categories/entities/category.entity';
import { Customization } from '../customizations/entities/customization.entity';
import { Menu } from '../menu/entities/menu.entity';

async function seed(): Promise<void> {
  await dataSource.initialize();

  try {
    const counts = await dataSource.transaction(async (manager) => {
      const categories = manager.getRepository(Category);
      const customizations = manager.getRepository(Customization);
      const menu = manager.getRepository(Menu);

      const categoriesByName = new Map<string, Category>();
      for (const categoryData of dummyData.categories) {
        let category = await categories.findOneBy({ name: categoryData.name });
        if (!category) {
          category = categories.create(categoryData);
        } else {
          categories.merge(category, categoryData);
        }
        categoriesByName.set(
          categoryData.name,
          await categories.save(category),
        );
      }

      const customizationsByName = new Map<string, Customization>();
      for (const customizationData of dummyData.customizations) {
        let customization = await customizations.findOneBy({
          name: customizationData.name,
        });
        if (!customization) {
          customization = customizations.create(customizationData);
        } else {
          customizations.merge(customization, customizationData);
        }
        customizationsByName.set(
          customizationData.name,
          await customizations.save(customization),
        );
      }

      for (const menuData of dummyData.menu) {
        const category = categoriesByName.get(menuData.category_name);
        if (!category) {
          throw new Error(
            `Unknown category "${menuData.category_name}" in menu seed data`,
          );
        }

        const menuCustomizations = menuData.customizations.map((name) => {
          const customization = customizationsByName.get(name);
          if (!customization) {
            throw new Error(
              `Unknown customization "${name}" in menu seed data`,
            );
          }
          return customization;
        });

        const {
          category_name: _categoryName,
          customizations: _customizations,
          ...menuFields
        } = menuData;
        let item = await menu.findOneBy({ name: menuData.name });
        if (!item) {
          item = menu.create();
        }

        menu.merge(item, {
          ...menuFields,
          category,
          customization: menuCustomizations,
        });
        await menu.save(item);
      }

      return {
        categories: dummyData.categories.length,
        customizations: dummyData.customizations.length,
        menuItems: dummyData.menu.length,
      };
    });

    console.log(
      `Seed completed: ${counts.categories} categories, ` +
        `${counts.customizations} customizations, ${counts.menuItems} menu items.`,
    );
  } finally {
    await dataSource.destroy();
  }
}

seed().catch((error: unknown) => {
  console.error('Database seed failed:', error);
  process.exitCode = 1;
});
