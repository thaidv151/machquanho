<?php

namespace App\Services;

use App\Repositories\MenuItemRepository;

class MenuItemService extends BaseService
{
    protected MenuItemRepository $menuItemRepository;

    public function __construct(MenuItemRepository $menuItemRepository)
    {
        parent::__construct($menuItemRepository);
        $this->menuItemRepository = $menuItemRepository;
    }

    public function getPublicMenuItems(): array
    {
        return $this->menuItemRepository->getPublicMenuItems();
    }

    public function getAdminMenuItems(array $params = []): array
    {
        return $this->menuItemRepository->getAdminMenuItems($params);
    }

    public function reorder(array $orderedIds): bool
    {
        foreach ($orderedIds as $index => $id) {
            $this->menuItemRepository->update($id, ['sort_order' => $index + 1]);
        }
        return true;
    }
}
